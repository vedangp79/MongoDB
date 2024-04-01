// Query 2
// Unwind friends and create a collection called 'flat_users' where each document has the following schema:
// {
//   user_id:xxx
//   friends:xxx
// }
// Return nothing.

function unwind_friends(dbname) {
    db = db.getSiblingDB(dbname);

    // TODO: unwind friends
    db.users.aggregate([
        // Deconstructs the friends array
        { $unwind: "$friends" },
        // Project the desired document structure
        { $project: { 
            _id: 0, // Excludes the _id field from the projection
            user_id: "$user_id", // Keeps the user_id
            friends: "$friends" // Includes the deconstructed friends value
        }},
        // Output the documents to the 'flat_users' collection
        { $out: "flat_users" }
    ]);

    return;
}
