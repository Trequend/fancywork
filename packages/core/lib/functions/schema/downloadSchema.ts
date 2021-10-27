import { Schema } from 'lib/types';

export function downloadSchema(schema: Schema, minimized?: boolean) {
  const json = JSON.stringify(
    schema,
    (key, value) => {
      return key.startsWith('_') ? undefined : value;
    },
    minimized ? undefined : 2
  );
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.download = `${schema.metadata.name}.json`;
  anchor.href = url;
  anchor.onclick = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  };

  anchor.click();
  anchor.remove();
}
