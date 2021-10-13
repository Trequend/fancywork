export async function getWorkerResult<Input, Output>(
  worker: Worker,
  message: Input
): Promise<Output> {
  return await new Promise<Output>((resolve, reject) => {
    const onMessage = ({ data }: MessageEvent<any>) => {
      removeEventListeners();
      resolve(data as Output);
    };

    const onMessageError = () => {
      removeEventListeners();
      reject(new Error('Wrong message from worker'));
    };

    const onError = (e: ErrorEvent) => {
      console.log(e);
      removeEventListeners();
      reject(e.error);
    };

    function removeEventListeners() {
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('messageError', onMessageError);
      worker.removeEventListener('error', onError);
    }

    worker.addEventListener('message', onMessage);
    worker.addEventListener('messageerror', onMessageError);
    worker.addEventListener('error', onError);

    worker.postMessage(message);
  });
}
