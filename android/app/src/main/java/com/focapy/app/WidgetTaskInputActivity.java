package com.focapy.app;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.content.Context;
import android.widget.EditText;
import android.widget.Toast;

public class WidgetTaskInputActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.widget_task_input);
        EditText title = findViewById(R.id.widget_task_title);
        findViewById(R.id.widget_task_cancel).setOnClickListener(view -> finish());
        findViewById(R.id.widget_task_save).setOnClickListener(view -> {
            if (TaskMonitorWidgetProvider.enqueueCreatedTask(this, title.getText().toString()) == null) {
                title.setError("Digite uma tarefa");
                return;
            }
            Toast.makeText(this, "Tarefa criada", Toast.LENGTH_SHORT).show();
            finish();
        });
        title.requestFocus();
        title.postDelayed(() -> {
            InputMethodManager keyboard = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            keyboard.showSoftInput(title, InputMethodManager.SHOW_IMPLICIT);
        }, 150);
    }
}
