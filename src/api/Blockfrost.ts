// eslint-disable-next-line import/prefer-default-export
export const Blockfrost = () => {
  return {
    name: 'data',
    exec: {
      request: async (endpoint: string, type?: string): Promise<any> => {
        if (!type) {
          // eslint-disable-next-line no-param-reassign
          type = 'get';
        }

        const address = `/api/blockfrost${endpoint}`;

        const response = await fetch(address, {
          headers: {'Content-Type': 'application/json'},
          method: type,
        })
          .then(r => r.json())
          .catch((e: any) => Promise.reject(e));

        return response;
      },
    },
  };
};
