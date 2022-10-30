const fsPromises = require('fs').promises;
const axios = require('axios');

(async () => {
  try {
    const iexecOut = process.env.IEXEC_OUT;
    // get the secret endpoint from requester secrets
    const secretNamespace = process.env.IEXEC_REQUESTER_SECRET_1;
    const secretKey = process.env.IEXEC_REQUESTER_SECRET_2;
    if (!secretNamespace) {
        console.log('missing requester secret 1 (namespace)');
        process.exit(1);
    }
    if (!secretKey) {
        console.log('missing requester secret 2 (key)');
        process.exit(1);
    }
    // get the hit count from countapi
    const hitCount = await axios.get(`https://api.countapi.xyz/hit/${secretNamespace}/${secretKey}`)
        .then(({data}) => data.value);

    const result = `endpoint hit ${hitCount} times`;
    console.log(result);
    // write the result
    await fsPromises.writeFile(`${iexecOut}/result.txt`, result);
    // declare everything is computed
    const computedJsonObj = {
        'deterministic-output-path': `${iexecOut}/result.txt`,
    };
    await fsPromises.writeFile(
        `${iexecOut}/computed.json`,
      JSON.stringify(computedJsonObj),
    );
  } catch (e) {
    // do not log anything that could reveal the requester secrets!
    console.log('something went wrong');
    process.exit(1);
  }
})();