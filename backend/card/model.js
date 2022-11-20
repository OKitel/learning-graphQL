const Mongoose = require("mongoose");
const { isNumberObject } = require("util/types");
const cardSchema = new Mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: String,
    pos: {
      type: Number,
      required: true,
    },
    sectionId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  },
  { timestamps: true }
);

//Card Repository
class Card {
  static insertCard(cardInfo) {
    const card = this(cardInfo);
    return card.save();
  }

  static getCardBySectionId(sectionId) {
    return this.find({ sectionId }).sort("pos").exec();
  }

  static updatePos(cardId, pos, sectionId) {
    return this.findOneAndUpdate(
      {
        _id: Mongoose.mongo.ObjectId(caredId),
      },
      { $set: { pos, sectionId } }
    ).exec();
  }
}

cardSchema.loadClass(Card);
module.exports = Mongoose.model("Card", cardSchema);
