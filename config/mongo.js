const mongoose = require('mongoose');
const connectdb = (url) => {
    main()
    .then(console.log("Mongo connected succesfully"))
    .catch(err => console.log(err))

    async function main() {
        await mongoose.connect(url,{
            // useNewUrlParser: true,
            // useUnifiedTopology: true,            no effect for them
        });

    }
}
module.exports = {
    connectdb
}