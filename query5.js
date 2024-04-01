// Query 5
// Find the oldest friend for each user who has a friend. For simplicity,
// use only year of birth to determine age, if there is a tie, use the
// one with smallest user_id. You may find query 2 and query 3 helpful.
// You can create selections if you want. Do not modify users collection.
// Return a javascript object : key is the user_id and the value is the oldest_friend id.
// You should return something like this (order does not matter):
// {user1:userx1, user2:userx2, user3:userx3,...}

function oldest_friend(dbname) {
    db = db.getSiblingDB(dbname);

    let results = {};
    // TODO: implement oldest friends

    let users = db.users.find({}); // Fetch all users
    users.forEach(user => {
        
        let friendsOfUser = user.friends;
        
        // Fetch potential friends where the current user might be listed in their friends array
        let potentialFriends = db.users.find({
            $or: [
                { user_id: { $in: friendsOfUser } },
                { friends: user.user_id }
            ]
        }).toArray();

        // Filter to retain only the oldest friend, taking ties into account by sorting
        let oldestFriend = potentialFriends.sort((a, b) => {
            if (a.YOB !== b.YOB) return a.YOB - b.YOB; // Older friend first
            return a.user_id - b.user_id; // Resolve ties by user_id
        })[0];

        if (oldestFriend) {
            results[user.user_id] = oldestFriend.user_id;
        }
    });
    return results;
}
