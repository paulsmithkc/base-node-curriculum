const bcrypt = require('bcrypt');
const password = 'P@ssw0rd';
const hash = '$2b$10$CT9Zc1T4prHKeYbGs5zQVulL49Okjb.shYEBFma0dW.drNzNJdCny';

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(password);
    console.log(hash);
    console.log(result);
  }
});

// (async () => {
//   try {
//     const result = await bcrypt.compare(password, hash);
//     console.log(password);
//     console.log(hash);
//     console.log(result);
//   } catch (err) {
//     console.error(err);
//   }
// })();
