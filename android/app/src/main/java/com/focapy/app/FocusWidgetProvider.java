package com.focapy.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.RemoteViews;

public class FocusWidgetProvider extends AppWidgetProvider {
    private static final String ACTION = "com.focapy.app.FOCUS_WIDGET";
    private static final String EXTRA = "action";
    private static final String FOCUS = "focus", STOPWATCH = "stopwatch", PAUSE = "pause", RESUME = "resume", END = "end";

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) manager.updateAppWidget(id, views(context, id));
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (!ACTION.equals(intent.getAction())) return;
        String action = intent.getStringExtra(EXTRA);
        if (FOCUS.equals(action)) FocapyWidgetState.start(context, "foco");
        else if (STOPWATCH.equals(action)) FocapyWidgetState.start(context, "cronometro");
        else if (PAUSE.equals(action)) FocapyWidgetState.pause(context);
        else if (RESUME.equals(action)) FocapyWidgetState.resume(context);
        else if (END.equals(action)) FocapyWidgetState.reset(context);
        else return;
        updateAllWidgets(context);
    }

    private static RemoteViews views(Context context, int id) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.focapy_focus_widget);
        boolean active = FocapyWidgetState.hasSession(context);
        boolean running = FocapyWidgetState.running(context);
        boolean focus = "foco".equals(FocapyWidgetState.mode(context));
        long minutes = FocapyWidgetState.duration(context) / 60_000L;
        views.setViewVisibility(R.id.focus_widget_picker, active ? View.GONE : View.VISIBLE);
        views.setViewVisibility(R.id.focus_widget_session, active ? View.VISIBLE : View.GONE);
        views.setTextViewText(R.id.focus_widget_status, !active ? "Pronto para cultivar"
            : focus ? (running ? "FOCO EM ANDAMENTO" : "FOCO PAUSADO")
            : (running ? "CRONÔMETRO EM ANDAMENTO" : "CRONÔMETRO PAUSADO"));
        views.setTextViewText(R.id.focus_widget_duration, minutes + " min");
        views.setChronometer(R.id.focus_widget_timer, FocapyWidgetState.timerBase(context), null, active && running);
        views.setChronometerCountDown(R.id.focus_widget_timer, focus);
        views.setViewVisibility(R.id.focus_widget_pause, active && running ? View.VISIBLE : View.GONE);
        views.setViewVisibility(R.id.focus_widget_resume, active && !running ? View.VISIBLE : View.GONE);
        views.setOnClickPendingIntent(R.id.focus_widget_start, broadcast(context, FOCUS, id));
        views.setOnClickPendingIntent(R.id.focus_widget_stopwatch, broadcast(context, STOPWATCH, id));
        views.setOnClickPendingIntent(R.id.focus_widget_pause, broadcast(context, PAUSE, id));
        views.setOnClickPendingIntent(R.id.focus_widget_resume, broadcast(context, RESUME, id));
        views.setOnClickPendingIntent(R.id.focus_widget_end, broadcast(context, END, id));
        Intent durationIntent = new Intent(context, FocusDurationActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        views.setOnClickPendingIntent(R.id.focus_widget_duration, PendingIntent.getActivity(
            context, 810000 + id, durationIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
        return views;
    }

    private static PendingIntent broadcast(Context context, String action, int id) {
        Intent intent = new Intent(context, FocusWidgetProvider.class).setAction(ACTION).putExtra(EXTRA, action);
        return PendingIntent.getBroadcast(context, id * 31 + action.hashCode(), intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    public static void updateAllWidgets(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, FocusWidgetProvider.class));
        for (int id : ids) manager.updateAppWidget(id, views(context, id));
    }
}
