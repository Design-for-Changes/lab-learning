"""Check the downloadable NumPy example and record independent reference values."""
from pathlib import Path
import contextlib
import io
import json
import runpy

root=Path(__file__).resolve().parents[1]
path=root/'public/data/ai/architectures.py'
output=io.StringIO()
with contextlib.redirect_stdout(output): result=runpy.run_path(str(path))
reference={'cnn':result['cnn_results'],'attention':result['attention_results'],
           'gan':result['gan_results'],'code':path.read_text(),'output':output.getvalue()}
(root/'src/architectureExampleResults.json').write_text(json.dumps(reference,ensure_ascii=False,indent=2)+'\n')
print('NumPy: CNN, attention, and GAN reference values generated.')
