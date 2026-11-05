package com.contour.app.guidance

/** Speech boundary. Implement using Android TextToSpeech and release its resources on close. */
interface VoiceGuide {
    fun speak(instruction: String)
    fun stop()
}
