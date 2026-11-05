package com.contour.app.ui.destinations

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.contour.app.data.ContourRepository
import com.contour.app.data.model.Destination
import java.io.IOException
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONException

sealed interface DestinationState {
    data object Loading : DestinationState
    data class Ready(val destinations: List<Destination>) : DestinationState
    data object Failed : DestinationState
}
class DestinationViewModel : ViewModel() {
    private val repository = ContourRepository()
    private val mutableState = MutableStateFlow<DestinationState>(DestinationState.Loading)
    val state = mutableState.asStateFlow()
    init { refresh() }
    fun refresh() {
        viewModelScope.launch {
            mutableState.value = DestinationState.Loading
            try { mutableState.value = DestinationState.Ready(repository.destinations()) }
            catch (error: CancellationException) { throw error }
            catch (_: IOException) { mutableState.value = DestinationState.Failed }
            catch (_: JSONException) { mutableState.value = DestinationState.Failed }
        }
    }
}
