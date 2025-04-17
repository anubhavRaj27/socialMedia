import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserByName =  async (req,res) => {
  try {
    const { userName } = req.params;          // "jack neuman"
    const terms = userName.trim().split(/\s+/);

    let query;

    if (terms.length === 1) {
      // single word → look in either first or last name
      const term = terms[0];
      query = {
        $or: [
          { firstName: { $regex: term, $options: "i" } },
          { lastName:  { $regex: term, $options: "i" } }
        ]
      };
    } else {
      const [first, last] = terms;
      // two words → match them in either order
      query = {
        $or: [
          { $and: [
              { firstName: { $regex: first, $options: "i" } },
              { lastName:  { $regex: last,  $options: "i" } }
            ]},
          { $and: [
              { firstName: { $regex: last,  $options: "i" } },
              { lastName:  { $regex: first, $options: "i" } }
            ]}
        ]
      };
    }

    const users = await User.find(query).select("-password"); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}