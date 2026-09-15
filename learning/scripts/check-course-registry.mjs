import assert from 'node:assert/strict';

export function checkCourseRegistry({ courses, learningPaths, resolveLearningRoute, findCourse, courseForRoute }) {
  const availableCourses = courses.filter(course => course.path);
  assert.equal(new Set(availableCourses.map(course => course.path)).size, availableCourses.length, 'Course entry paths must be unique');
  const chapterPaths = availableCourses.flatMap(course => course.links.map(([path]) => path));
  assert.equal(new Set(chapterPaths).size, chapterPaths.length, 'A chapter must belong to only one course');

  for (const course of availableCourses) {
    assert.ok(course.links.length, `${course.path}: missing first chapter`);
    for (const [path] of course.links) {
      assert.equal(findCourse(path), course, `${path}: wrong course navigation`);
      assert.ok(learningPaths.includes(path), `${path}: not included in the static build`);
    }
  }
  for (const path of learningPaths) {
    const target = resolveLearningRoute(path);
    assert.ok(learningPaths.includes(target), `${path}: alias target is not built`);
    assert.equal(resolveLearningRoute(target), target, `${path}: alias requires another redirect`);
  }

  // Historical links must keep their destinations even across course boundaries.
  for (const [oldPath, target] of [
    ['/statistics', '/statistics/basics'],
    ['/statistics/distributions', '/statistics/basics'],
    ['/statistics/methods', '/statistics/choose'],
    ['/ai/systems', '/ai-intro/systems'],
    ['/design/dialogue', '/design/concepts'],
    ['/design/inquiry', '/design/process'],
  ]) assert.equal(resolveLearningRoute(oldPath), target);

  assert.equal(courseForRoute('/ai/networks'), '人工知能学習入門');
  assert.equal(courseForRoute('/ai-intro/systems'), 'AI入門');
  assert.equal(findCourse('/ai-introduction'), undefined, 'Match a complete path segment, not just a prefix');
  assert.equal(findCourse('/missing'), undefined);
  const statistics = findCourse('/statistics/method/pca');
  assert.equal(statistics.activeChapter('/statistics/method/pca'), '/statistics/choose');
  console.log('Course registry: unique chapters, built aliases, course boundaries and method navigation passed.');
}
