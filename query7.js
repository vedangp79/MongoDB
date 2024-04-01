
// Query 7
// Return the number of users born in each month as a new collection
// named countbymonth that has the following schema
//
// MOB: xxx
// borncount: xxx
// 
// You need to use aggregate for an acceptable solution.
// You will likely find it useful to use the following 
// elements in the aggregate pipeline:
// $group
// $sort
// $addFields: to add a column called MOB
// $project: you may need it to remove _id created by group (another
// _id may get added back in when the output table is created. That is OK.)
// $out: to output the result to the new collection.
//


function users_born_by_month(dbname) {
	db.getSiblingDB(dbname);
	
	db.users.aggregate([
        {
            // Group documents by the 'MOB' field and count the number of users in each group
            $group: {
                _id: "$MOB",
                borncount: { $sum: 1 } // Increment count for each document in the group
            }
        },
        {
            // Add the MOB field back, using the id field value
            $addFields: { MOB: "$_id" }
        },
        {
            // Project the desired fields, excluding the original id field
            $project: {
                _id: 0, // Exclude the _id field from the results
                MOB: 1, // Include the MOB field
                borncount: 1 // Include the 'borncount' field
            }
        },
        {
            // Sort the results by 'MOB' to ensure they are ordered from January to December
            $sort: { MOB: 1 }
        },
        {
            // Output the result to a new collection named 'countbymonth'
            $out: "countbymonth"
        }
    ]);

}

