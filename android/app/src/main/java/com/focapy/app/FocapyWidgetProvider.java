package com.focapy.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

public class FocapyWidgetProvider extends AppWidgetProvider {
    public static final String ACTION_WIDGET = "com.focapy.app.WIDGET_ACTION";
    public static final String EXTRA_WIDGET_ACTION = "widget_action";
    public static final String ACTION_FOCUS = "focus";
    public static final String ACTION_STOPWATCH = "stopwatch";
    public static final String ACTION_TASKS = "tasks";

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] widgetIds) {
        for (int widgetId : widgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.focapy_widget);
            views.setOnClickPendingIntent(R.id.widget_focus, actionIntent(context, ACTION_FOCUS, widgetId));
            views.setOnClickPendingIntent(R.id.widget_stopwatch, actionIntent(context, ACTION_STOPWATCH, widgetId));
            views.setOnClickPendingIntent(R.id.widget_tasks, actionIntent(context, ACTION_TASKS, widgetId));
            manager.updateAppWidget(widgetId, views);
        }
    }

    private PendingIntent actionIntent(Context context, String action, int widgetId) {
        Intent intent = new Intent(context, MainActivity.class)
            .setAction(ACTION_WIDGET)
            .putExtra(EXTRA_WIDGET_ACTION, action)
            .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        int requestCode = widgetId * 10 + action.hashCode();
        return PendingIntent.getActivity(context, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
}
