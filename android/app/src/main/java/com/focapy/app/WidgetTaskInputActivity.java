package com.focapy.app;

import android.app.Activity;
import android.os.Bundle;
import android.view.inputmethod.InputMethodManager;
import android.content.Context;
import android.content.Intent;
import android.widget.EditText;
import android.widget.Toast;

public class WidgetTaskInputActivity extends Activity {
    @Override protected void onCreate(Bundle state) {
        super.onCreate(state); setContentView(R.layout.widget_task_input);
        EditText title=findViewById(R.id.widget_task_title); String taskId=getIntent().getStringExtra(TaskMonitorWidgetProvider.EXTRA_TASK_ID);
        boolean editing=taskId!=null&&!taskId.isEmpty(); title.setText(editing?getIntent().getStringExtra(TaskMonitorWidgetProvider.EXTRA_TASK_TITLE):"");
        findViewById(R.id.widget_task_cancel).setOnClickListener(v->finish());
        findViewById(R.id.widget_task_save).setOnClickListener(v->{String value=title.getText().toString();if(value.trim().isEmpty()){title.setError("Digite uma tarefa");return;}if(editing)TaskMonitorWidgetProvider.updateTaskTitle(this,taskId,value);else TaskMonitorWidgetProvider.enqueueCreatedTask(this,value);Toast.makeText(this,editing?"Tarefa atualizada":"Tarefa criada",Toast.LENGTH_SHORT).show();finish();});
        findViewById(R.id.widget_task_complete).setOnClickListener(v->{if(editing){TaskMonitorWidgetProvider.completeTaskFromDialog(this,taskId);Toast.makeText(this,"Tarefa concluída",Toast.LENGTH_SHORT).show();}finish();});
        findViewById(R.id.widget_task_complete).setVisibility(editing?android.view.View.VISIBLE:android.view.View.GONE);
        title.requestFocus(); title.postDelayed(()->{InputMethodManager k=(InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);k.showSoftInput(title,InputMethodManager.SHOW_IMPLICIT);},150);
    }
}
