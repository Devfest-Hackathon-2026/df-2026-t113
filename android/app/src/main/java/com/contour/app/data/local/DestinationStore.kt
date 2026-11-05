package com.contour.app.data.local

import android.content.Context
import com.contour.app.data.model.Destination
import org.json.JSONArray
import org.json.JSONObject

/** Store a small destination cache; cached data does not establish current opening status. */
class DestinationStore(context: Context) {
    private val preferences = context.getSharedPreferences("contour", Context.MODE_PRIVATE)
    fun save(destinations: List<Destination>) {
        val rows = JSONArray()
        destinations.forEach { site -> rows.put(JSONObject().put("id", site.id).put("name", site.name).put("latitude", site.latitude).put("longitude", site.longitude).put("isDemo", site.isDemo)) }
        preferences.edit().putString("destinations", rows.toString()).apply()
    }
    fun load(): List<Destination> {
        val rows = JSONArray(preferences.getString("destinations", "[]") ?: "[]")
        return List(rows.length()) { index ->
            val row = rows.getJSONObject(index)
            Destination(row.getString("id"), row.getString("name"), row.getDouble("latitude"), row.getDouble("longitude"), row.getBoolean("isDemo"), "unknown")
        }
    }
}
