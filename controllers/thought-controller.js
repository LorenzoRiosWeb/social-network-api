const { Thought, User } = require("../models");

const thoughtController = {
  // get all Thoughts
  async getAllThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find({})
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(dbThoughtData);
    } catch (err) {
      console.error("Error fetching thoughts:", err);
      res.status(500).json({ error: "An error occurred while fetching thoughts." });
    }
  },

  // get one Thought by id
  async getThoughtById(req, res) {
    try {
      const dbThoughtData = await Thought.findOne({ _id: req.params.id })
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v");

      if (!dbThoughtData) {
        return res.status(404).json({ error: "No thought found with this id." });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.error("Error fetching thought by id:", err);
      res.status(500).json({ error: "An error occurred while fetching the thought." });
    }
  },

  // create Thought
  async createThought(req, res) {
    try {
      const createdThought = await Thought.create(req.body);
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: createdThought._id } },
        { new: true }
      );
      res.status(201).json({ message: "Thought successfully created.", createdThought });
    } catch (err) {
      console.error("Error creating thought:", err);
      res.status(500).json({ error: "An error occurred while creating the thought." });
    }
  },

  // update Thought by id
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ error: "No thought found with this id." });
      }

      res.json({ message: "Thought successfully updated.", updatedThought });
    } catch (err) {
      console.error("Error updating thought:", err);
      res.status(500).json({ error: "An error occurred while updating the thought." });
    }
  },

  // delete Thought
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({ _id: req.params.id });

      if (!deletedThought) {
        return res.status(404).json({ error: "No thought found with this id." });
      }

      await User.findOneAndUpdate(
        { thoughts: req.params.id },
        { $pull: { thoughts: req.params.id } },
        { new: true }
      );

      res.json({ message: "Thought successfully deleted.", deletedThought });
    } catch (err) {
      console.error("Error deleting thought:", err);
      res.status(500).json({ error: "An error occurred while deleting the thought." });
    }
  },

  // add reaction
  async addReaction(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ error: "No thought found with this id." });
      }

      res.json({ message: "Reaction added successfully.", updatedThought });
    } catch (err) {
      console.error("Error adding reaction:", err);
      res.status(500).json({ error: "An error occurred while adding the reaction." });
    }
  },

  // delete reaction
  async removeReaction(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );

      res.json({ message: "Reaction removed successfully.", updatedThought });
    } catch (err) {
      console.error("Error removing reaction:", err);
      res.status(500).json({ error: "An error occurred while removing the reaction." });
    }
  },
};

module.exports = thoughtController;
