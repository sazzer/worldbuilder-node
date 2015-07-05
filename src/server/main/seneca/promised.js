/**
 * Seneca Extension to allow actions to be performed as promises
 * @param {Seneca} seneca the Seneca instance to extend
 * @return {Seneca} the extended Seneca instance
 */
export function senecaAsPromised(seneca) {
    seneca.actAsPromised = (action) => {
        return new Promise((resolve, reject) => {
            seneca.act(action, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };

    return seneca;
}
