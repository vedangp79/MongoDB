// Query 6
// Find the average friend count per user.
// Return a decimal value as the average user friend count of all users in the users collection.

function find_average_friendcount(dbname) {
    db = db.getSiblingDB(dbname);

    // TODO: calculate the average friend count
    // Aggregate pipeline to calculate average friend count
    let result = db.users.aggregate([
        {
            // Project a new field "friendCount" that represents the size of each user's friends array
            $project: {
                _id: 0, // Exclude the _id field from the output
                friendCount: { 
                    $cond: {
                        if: { $isArray: "$friends" }, // Check if "friends" field is an array
                        then: { $size: "$friends" }, // If yes, count the number of elements in the array
                        else: 0 // If no (e.g., "friends" field is missing or not an array), treat as 0 friends
                    }
                }
            }
        },
        {
            // Group all documents together to calculate the average
            $group: {
                _id: null, // Group all documents into a single group
                averageFriendCount: { $avg: "$friendCount" } // Calculate the average of "friendCount" field
            }
        },
        {
            $project: {
                _id: 0, // Exclude the _id field from the output
                averageFriendCount: 1 // Include only the "averageFriendCount" field in the output
            }
        }
    ]);

    // Extract the average friend count from the aggregation result
    if (result.hasNext()) { // Check if there is a result
        let avgResult = result.next();
        return avgResult.averageFriendCount;
    }

    return 0;
}
