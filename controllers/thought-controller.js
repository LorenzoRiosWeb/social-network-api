const { Thought, User } = require("../models");

const thoughtController = {
  // get all Thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.error("Error fetching thoughts:", err);
        res.status(500).json({ error: "An error occurred while fetching thoughts." });
      });
  },

  // get one Thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ error: "No thought found with this id." });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.error("Error fetching thought by id:", err);
        res.status(500).json({ error: "An error occurred while fetching the thought." });
      });
  },

  // create Thought
  // push the created thought's _id to the associated user's thoughts array field
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: _id } },
        { new: true }
      ))
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ error: "User not found with the provided id." });
        }
        res.status(201).json({ message: "Thought successfully created.", createdThought: dbUserData });
      })
      .catch((err) => {
        console.error("Error creating thought:", err);
        res.status(500).json({ error: "An error occurred while creating the thought." });
      });
  },

  // update Thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ error: "No thought found with this id." });
        }
        res.json({ message: "Thought successfully updated.", updatedThought: dbThoughtData });
      })
      .catch((err) => {
        console.error("Error updating thought:", err);
        res.status(500).json({ error: "An error occurred while updating the thought." });
      });
  },

  // delete Thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ error: "No thought found with this id." });
        }
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ error: "Thought deleted but no user found with this id." });
        }
        res.json({ message: "Thought successfully deleted.", deletedThought: dbThoughtData });
      })
      .catch((err) => {
        console.error("Error deleting thought:", err);
        res.status(500).json({ error: "An error occurred while deleting the thought." });
      });
  },

  // add reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ error: "No thought found with this id." });
        }
        res.json({ message: "Reaction added successfully.", updatedThought: dbThoughtData });
      })
      .catch((err) => {
        console.error("Error adding reaction:", err);
        res.status(500).json({ error: "An error occurred while adding the reaction." });
      });
  },

  // delete reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json({ message: "Reaction removed successfully.", updatedThought: dbThoughtData }))
      .catch((err) => {
        console.error("Error removing reaction:", err);
        res.status(500).json({ error: "An error occurred while removing the reaction." });
      });
  },
};

module.exports = thoughtController;
