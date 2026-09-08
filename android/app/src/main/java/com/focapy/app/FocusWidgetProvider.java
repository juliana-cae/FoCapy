package com.focapy.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.RemoteViews;

public class FocusWidgetProvider extends AppWidgetProvider {
    private static final String ACTION = "com.focapy.app.FOCUS_WIDGET";
    private static final String EXTRA_ACTION = "focus_widget_action";
    private static final String START_FOCUS = "start_focus";
    private static final String START_STOPWATCH = "start_stopwatch";
    private static final String PAUSE = "pause";
    private static final String RESET = "reset";

    @Override public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) manager.updateAppWidget(id, render(context, id));
    }

    @Override public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String action = intent.getStringExtra(EXTRA_ACTION);
        if (START_FOCUS.equals(action)) FocapyWidgetState.start(context, "foco");
        if (START_STOPWATCH.equals(action)) FocapyWidgetState.start(context, "cronometro");
        if (PAUSE.equals(action)) FocapyWidgetState.pause(context);
        if (RESET.equals(action)) FocapyWidgetState.reset(context);
        if (action != null) updateAll(context);
    }

    private static RemoteViews render(Context context, int id) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.focapy_focus_widget);
        boolean running = FocapyWidgetState.running(context);
        String mode = FocapyWidgetState.mode(context);
        views.setTextViewText(R.id.focus_widget_status, running ? ("foco".equals(mode) ? "FOCO EM ANDAMENTO" : "CRONÔMETRO EM ANDAMENTO") : "PRONTO PARA COMEÇAR");
        views.setChronometer(R.id.focus_widget_timer, FocapyWidgetState.chronometerBase(context), null, running);
        views.setViewVisibility(R.id.focus_widget_pause, running ? View.VISIBLE : View.GONE);
        views.setViewVisibility(R.id.focus_widget_reset, running || FocapyWidgetState.elapsed(context) > 0 ? View.VISIBLE : View.GONE);
        views.setOnClickPendingIntent(R.id.focus_widget_start, pending(context, START_FOCUS, id));
        views.setOnClickPendingIntent(R.id.focus_widget_stopwatch, pending(context, START_STOPWATCH, id));
        views.setOnClickPendingIntent(R.id.focus_widget_pause, pending(context, PAUSE, id));
        views.setOnClickPendingIntent(R.id.focus_widget_reset, pending(context, RESET, id));
        return views;
    }

    private static PendingIntent pending(Context context, String action, int id) {
        Intent intent = new Intent(context, FocusWidgetProvider.class).setAction(ACTION).putExtra(EXTRA_ACTION, action);
        return PendingIntent.getBroadcast(context, id * 31 + action.hashCode(), intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static void updateAll(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new android.content.ComponentName(context, FocusWidgetProvider.class));
        for (int id : ids) manager.updateAppWidget(id, render(context, id));
    }
}
