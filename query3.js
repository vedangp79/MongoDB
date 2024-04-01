// Query 3
// Create a collection "cities" to store every user that lives in every city. Each document(city) has following schema:
// {
//   _id: city
//   users:[userids]
// }
// Return nothing.

function cities_table(dbname) {
    db = db.getSiblingDB(dbname);

    // TODO: implement cities collection here
    db.users.aggregate([
        { $group: {
            _id: "$current.city", // Group by the 'city' field inside the 'current' object
            users: { $addToSet: "$user_id" } // Use $addToSet to ensure user_ids are distinct
        }},
        // Output the result to the 'cities' collection
        { $out: "cities" }
    ]);

    return;
}
