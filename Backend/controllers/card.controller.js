import mongoose from "mongoose";
import Card from "../models/card.model.js";
import Interaction from "../models/interaction.model.js";

const createCard = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const card = await Card.create({
      title,
      description,
      category,
      image,
    });

    res.status(201).json({
      message: "Card create successfully...",
      success: true,
      data: card,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCards = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const userId = req.user.id;

    const totalCards = await Card.countDocuments();

    const cards = await Card.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    const interactions = await Interaction.find({
      userId,
      cardId: { $in: cards.map((card) => card._id) },
    });

    const cardWithAction = cards.map((card) => {
      const interaction = interactions.find(
        (item) => item.cardId.toString() === card._id.toString(),
      );

      return {
        ...card.toObject(),
        userAction: interaction ? interaction.action : null,
      };
    });

    return res.status(200).json({
      message: "Cards fetched successfully...",
      success: true,
      data: cardWithAction,
      pagination: {
        total: totalCards,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCards / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    const existingInteraction = await Interaction.findOne({
      userId,
      cardId: id,
    });

    if (existingInteraction) {
      existingInteraction.action = "like";
      existingInteraction.category = card.category;

      await existingInteraction.save();
    } else {
      await Interaction.create({
        userId,
        cardId: id,
        category: card.category,
        action: "like",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Card liked successfully..." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    const existingInteraction = await Interaction.findOne({
      userId,
      cardId: id,
    });

    if (existingInteraction) {
      existingInteraction.action = "dislike";
      existingInteraction.category = card.category;

      await existingInteraction.save();
    } else {
      await Interaction.create({
        userId,
        cardId: id,
        category: card.category,
        action: "dislike",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Card dislike successfully...",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecommendedCards = async (req, res) => {
  try {
    const userId = req.user.id;

    const preferences = await Interaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$category",
          score: {
            $sum: {
              $cond: [{ $eq: ["$action", "like"] }, 1, -1],
            },
          },
        },
      },

      {
        $sort: {
          score: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (!preferences.length) {
      const cards = await Card.find().limit(10).sort({ createdAt: -1 });

      const interactions = await Interaction.find({
        userId,
        cardId: {
          $in: cards.map((card) => card._id),
        },
      });

      const cardsWithAction = cards.map((card) => {
        const interaction = interactions.find(
          (item) => item.cardId.toString() === card._id.toString(),
        );

        return {
          ...card.toObject(),
          userAction: interaction ? interaction.action : null,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Latest cards fetched successfully",
        category: null,
        data: cardsWithAction,
      });
    }

    const preferredCategory = preferences[0]._id;

    const cards = await Card.find({
      category: preferredCategory,
    })
      .limit(10)
      .sort({ createdAt: -1 });

    const interactions = await Interaction.find({
      userId,
      cardId: {
        $in: cards.map((card) => card._id),
      },
    });

    const cardsWithAction = cards.map((card) => {
      const interaction = interactions.find(
        (item) => item.cardId.toString() === card._id.toString(),
      );

      return {
        ...card.toObject(),
        userAction: interaction ? interaction.action : null,
      };
    });

    if (!cards.length) {
      const fallbackCards = await Card.find().limit(10).sort({ createdAt: -1 });

      const fallbackInteractions = await Interaction.find({
        userId,
        cardId: {
          $in: fallbackCards.map((card) => card._id),
        },
      });

      const fallbackCardsWithAction = fallbackCards.map((card) => {
        const interaction = fallbackInteractions.find(
          (item) => item.cardId.toString() === card._id.toString(),
        );

        return {
          ...card.toObject(),
          userAction: interaction ? interaction.action : null,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Fallback cards fetched successfully",
        category: preferredCategory,
        data: fallbackCardsWithAction,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recommended cards fetched successfully",
      category: preferredCategory,
      data: cardsWithAction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createCard, getAllCards, likeCard, dislikeCard, getRecommendedCards };
