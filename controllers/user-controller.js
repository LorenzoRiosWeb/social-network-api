const { User, Thought } = require("../models");

const userController = {
  // get all users
  async getAllUser(req, res) {
    try {
      const dbUserData = await User.find({})
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // get one user by id
  async getUserById(req, res) {
    try {
      const dbUserData = await User.findOne({ _id: req.params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");

      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id!" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // create user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // update user by id
  async updateUser(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id!" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // delete user
  async deleteUser(req, res) {
    try {
      const dbUserData = await User.findOneAndDelete({ _id: req.params.id });

      if (!dbUserData) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });

      res.json({ message: "User and associated thoughts deleted!" });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // add friend
  async addFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No user with this id" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // delete friend
  async removeFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
};

module.exports = userController;
