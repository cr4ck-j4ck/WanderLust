const mongoose = require("mongoose");
const Review = require("./reviews.js");


const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://media.istockphoto.com/id/612255400/photo/kusum-sarovar.jpg?s=612x612&w=0&k=20&c=S_KX7oE-oj0IAj5Bhl9r4U2ZrGOcWT5ZkKco7K3sBkc=",
      set: url => url === "" ? "https://media.istockphoto.com/id/612255400/photo/kusum-sarovar.jpg?s=612x612&w=0&k=20&c=S_KX7oE-oj0IAj5Bhl9r4U2ZrGOcWT5ZkKco7K3sBkc=" : url,
    }
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

listingSchema.post("findOneAndDelete", async (data) => {
  await Review.deleteMany({ _id: { $in: data.reviews } });
});

const Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing;

