import { pageHref } from './pageRouting.js';

export default function PageLink({ href, ...props }) {
 return <a {...props} href={pageHref(href)}/>;
}
