package com.contour.app.ui.navigation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.contour.app.data.ContourRepository
import com.contour.app.data.model.NavigationRoute
import java.io.IOException
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONException

sealed interface NavigationState {
    data object Loading : NavigationState
    data class Ready(val route: NavigationRoute) : NavigationState
    data object Failed : NavigationState
}
class NavigationViewModel : ViewModel() {
    private val mutableState = MutableStateFlow<NavigationState>(NavigationState.Loading)
    val state = mutableState.asStateFlow()
    fun load(id: String) {
        viewModelScope.launch {
            mutableState.value = NavigationState.Loading
            try { mutableState.value = NavigationState.Ready(ContourRepository().directions(id)) }
            catch (error: CancellationException) { throw error }
            catch (_: IOException) { mutableState.value = NavigationState.Failed }
            catch (_: JSONException) { mutableState.value = NavigationState.Failed }
        }
    }
}
