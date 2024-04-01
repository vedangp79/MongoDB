import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.TreeSet;
import java.util.Vector;

import org.json.JSONObject;
import org.json.JSONArray;

public class GetData {

    static String prefix = "project3.";

    // You must use the following variable as the JDBC connection
    Connection oracleConnection = null;

    // You must refer to the following variables for the corresponding 
    // tables in your database
    String userTableName = null;
    String friendsTableName = null;
    String cityTableName = null;
    String currentCityTableName = null;
    String hometownCityTableName = null;

    // DO NOT modify this constructor
    public GetData(String u, Connection c) {
        super();
        String dataType = u;
        oracleConnection = c;
        userTableName = prefix + dataType + "_USERS";
        friendsTableName = prefix + dataType + "_FRIENDS";
        cityTableName = prefix + dataType + "_CITIES";
        currentCityTableName = prefix + dataType + "_USER_CURRENT_CITIES";
        hometownCityTableName = prefix + dataType + "_USER_HOMETOWN_CITIES";
    }

    // TODO: Implement this function
    @SuppressWarnings("unchecked")
    public JSONArray toJSON() throws SQLException {

        // This is the data structure to store all users' information
        JSONArray users_info = new JSONArray();
        
        try (Statement stmt = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY)) {
            // Your implementation goes here....
             String usersQuery = "SELECT * FROM " + userTableName;
            ResultSet rsUsers = stmt.executeQuery(usersQuery);
            while (rsUsers.next()) {
                JSONObject user = new JSONObject();
                int userId = rsUsers.getInt("user_id");
                user.put("user_id", userId);
                user.put("first_name", rsUsers.getString("first_name"));
                user.put("last_name", rsUsers.getString("last_name"));
                user.put("gender", rsUsers.getString("gender"));
                user.put("YOB", rsUsers.getInt("year_of_birth"));
                user.put("MOB", rsUsers.getInt("month_of_birth"));
                user.put("DOB", rsUsers.getInt("day_of_birth"));

                // Fetching friends based on the assumption that duplicates are handled in the DB
                try (Statement stmt2 = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY)) {
                JSONArray friends = new JSONArray();
                String friendsQuery = "SELECT user1_id, user2_id FROM " + friendsTableName + 
                    " WHERE user1_id = " + userId + " OR user2_id = " + userId;
                ResultSet rsFriends = stmt2.executeQuery(friendsQuery);
                while (rsFriends.next()) {
                    int user1_id = rsFriends.getInt("user1_id");
                    int user2_id = rsFriends.getInt("user2_id");
                    // If the current user is user1_id, then we check if user2_id is larger before adding.
                    if (user1_id == userId && user2_id > userId) {
                        friends.put(user2_id);
                    }                
                }
                user.put("friends", friends);
                

                JSONObject currentCity = getCurrentCityDetails(rsUsers.getInt("user_id"), stmt2);
                JSONObject hometown = getHometownDetails(rsUsers.getInt("user_id"), stmt2);
                
                user.put("current", currentCity);
                user.put("hometown", hometown);

                users_info.put(user);
                }
            }
        stmt.close();
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }

        return users_info;
    }

    // This outputs to a file "output.json"
    // DO NOT MODIFY this function
    public void writeJSON(JSONArray users_info) {
        try {
            FileWriter file = new FileWriter(System.getProperty("user.dir") + "/output.json");
            file.write(users_info.toString());
            file.flush();
            file.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private JSONObject getCurrentCityDetails(int userId, Statement stmt) throws SQLException {
        JSONObject currentCity = new JSONObject();
        String query = "SELECT city_name, state_name, country_name FROM " + cityTableName +
                       " JOIN " + currentCityTableName + " ON " + cityTableName + ".city_id = " +
                       currentCityTableName + ".current_city_id WHERE " +
                       currentCityTableName + ".user_id = " + userId;
        ResultSet rs = stmt.executeQuery(query);
        if (rs.next()) {
            currentCity.put("city", rs.getString("city_name"));
            currentCity.put("state", rs.getString("state_name"));
            currentCity.put("country", rs.getString("country_name"));
        }
        return currentCity;
    }

    private JSONObject getHometownDetails(int userId, Statement stmt) throws SQLException {
    JSONObject hometown = new JSONObject();
    String query = "SELECT c.city_name, c.state_name, c.country_name " +
                   "FROM " + cityTableName + " c JOIN " + hometownCityTableName + " htc " +
                   "ON c.city_id = htc.hometown_city_id " +
                   "WHERE htc.user_id = " + userId;
    ResultSet rs = stmt.executeQuery(query);
    if (rs.next()) {
        hometown.put("city", rs.getString("city_name"));
        hometown.put("state", rs.getString("state_name"));
        hometown.put("country", rs.getString("country_name"));
    }
    return hometown;
}

}
