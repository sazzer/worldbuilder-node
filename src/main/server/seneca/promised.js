/**
 * Seneca Extension to allow actions to be performed as promises
 * @param {Seneca} seneca the Seneca instance to extend
 * @param {Object} action The action to perform
 * @return {Promise} for the response of the action
 */
export function senecaAsPromised(seneca, action) {
    return new Promise((resolve, reject) => {
        seneca.act(action, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
