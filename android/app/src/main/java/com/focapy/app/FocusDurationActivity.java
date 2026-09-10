package com.focapy.app;

import android.app.Activity;
import android.os.Bundle;
import android.view.inputmethod.InputMethodManager;
import android.content.Context;
import android.widget.EditText;

public class FocusDurationActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.focus_duration_input);
        EditText minutes = findViewById(R.id.focus_duration_minutes);
        minutes.setText(String.valueOf(FocapyWidgetState.duration(this) / 60_000L));
        minutes.selectAll();
        findViewById(R.id.focus_duration_cancel).setOnClickListener(view -> finish());
        findViewById(R.id.focus_duration_save).setOnClickListener(view -> {
            try {
                int value = Integer.parseInt(minutes.getText().toString().trim());
                if (value < 1 || value > 480) throw new NumberFormatException();
                FocapyWidgetState.setDurationMinutes(this, value);
                finish();
            } catch (NumberFormatException error) {
                minutes.setError("Use de 1 a 480 minutos");
            }
        });
        minutes.requestFocus();
        minutes.postDelayed(() -> {
            InputMethodManager keyboard = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            keyboard.showSoftInput(minutes, InputMethodManager.SHOW_IMPLICIT);
        }, 150);
    }
}
