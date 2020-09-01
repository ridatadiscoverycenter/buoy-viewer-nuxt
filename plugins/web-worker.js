import ServerWorker from '~/assets/js/server.worker.js';

export default (context, inject) => {
  inject('worker', {
    createWorker() {
      return new ServerWorker();
    }
  });
};
