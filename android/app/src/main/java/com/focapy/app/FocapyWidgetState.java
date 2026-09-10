package com.focapy.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.SystemClock;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

public final class FocapyWidgetState {
    public static final long DEFAULT_FOCUS_DURATION_MS = 25L * 60L * 1000L;
    private static final String PREFS = "focapy_widget_state";
    private static final String MODE = "mode", RUNNING = "running", STARTED_ELAPSED = "started_elapsed";
    private static final String STARTED_WALL = "started_wall", ELAPSED = "elapsed", DURATION = "duration", TOKEN = "token";
    private FocapyWidgetState() {}

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static void setDurationMinutes(Context context, int minutes) {
        int safeMinutes = Math.max(1, Math.min(480, minutes));
        prefs(context).edit().putLong(DURATION, safeMinutes * 60_000L).apply();
        FocusWidgetProvider.updateAllWidgets(context);
    }

    public static long duration(Context context) {
        return Math.max(60_000L, prefs(context).getLong(DURATION, DEFAULT_FOCUS_DURATION_MS));
    }

    public static void start(Context context, String mode) {
        cancelAlarm(context);
        long nowElapsed = SystemClock.elapsedRealtime();
        long nowWall = System.currentTimeMillis();
        prefs(context).edit().putString(MODE, mode).putString(TOKEN, UUID.randomUUID().toString())
            .putLong(STARTED_ELAPSED, nowElapsed).putLong(STARTED_WALL, nowWall)
            .putLong(ELAPSED, 0L).putBoolean(RUNNING, true).apply();
        scheduleAlarm(context);
    }

    public static void pause(Context context) {
        if (!running(context)) return;
        prefs(context).edit().putLong(ELAPSED, elapsed(context)).putBoolean(RUNNING, false).apply();
        cancelAlarm(context);
    }

    public static void resume(Context context) {
        if (!hasSession(context) || running(context)) return;
        prefs(context).edit().putLong(STARTED_ELAPSED, SystemClock.elapsedRealtime())
            .putLong(STARTED_WALL, System.currentTimeMillis()).putBoolean(RUNNING, true).apply();
        scheduleAlarm(context);
    }

    public static void reset(Context context) {
        cancelAlarm(context);
        prefs(context).edit().remove(MODE).remove(RUNNING).remove(STARTED_ELAPSED)
            .remove(STARTED_WALL).remove(ELAPSED).remove(TOKEN).apply();
    }

    public static boolean running(Context context) { return prefs(context).getBoolean(RUNNING, false); }
    public static String mode(Context context) { return prefs(context).getString(MODE, "foco"); }
    public static String token(Context context) { return prefs(context).getString(TOKEN, ""); }
    public static boolean hasSession(Context context) { return !token(context).isEmpty(); }

    public static long elapsed(Context context) {
        SharedPreferences preferences = prefs(context);
        long base = Math.max(0L, preferences.getLong(ELAPSED, 0L));
        if (!preferences.getBoolean(RUNNING, false)) return base;
        long startedElapsed = preferences.getLong(STARTED_ELAPSED, SystemClock.elapsedRealtime());
        long monotonicDelta = SystemClock.elapsedRealtime() - startedElapsed;
        long delta = monotonicDelta >= 0 ? monotonicDelta
            : System.currentTimeMillis() - preferences.getLong(STARTED_WALL, System.currentTimeMillis());
        return base + Math.max(0L, delta);
    }

    public static long timerBase(Context context) {
        long elapsed = elapsed(context);
        return "foco".equals(mode(context))
            ? SystemClock.elapsedRealtime() + Math.max(0L, duration(context) - elapsed)
            : SystemClock.elapsedRealtime() - elapsed;
    }

    public static boolean isFocusFinished(Context context) {
        return "foco".equals(mode(context)) && elapsed(context) >= duration(context);
    }

    public static JSONObject snapshot(Context context) {
        if (!hasSession(context)) return null;
        JSONObject result = new JSONObject();
        try {
            result.put("token", token(context));
            result.put("mode", mode(context));
            result.put("running", running(context));
            result.put("elapsedSeconds", elapsed(context) / 1000L);
            result.put("durationSeconds", duration(context) / 1000L);
            long createdAt = prefs(context).getLong(STARTED_WALL, System.currentTimeMillis())
                - prefs(context).getLong(ELAPSED, 0L);
            result.put("startedAt", isoTime(createdAt));
            return result;
        } catch (Exception ignored) { return null; }
    }

    public static void acknowledgeTransfer(Context context, String transferredToken) {
        if (transferredToken.equals(token(context))) {
            reset(context);
            FocusWidgetProvider.updateAllWidgets(context);
        }
    }

    /** Returns a durable completion event only when this alarm still owns the running focus. */
    public static JSONObject completeFocusFromAlarm(Context context, String alarmToken) {
        if (!alarmToken.equals(token(context)) || !running(context) || !"foco".equals(mode(context))) return null;
        if (!isFocusFinished(context)) {
            scheduleAlarm(context);
            return null;
        }
        JSONObject event = new JSONObject();
        try {
            event.put("id", "focus-event-" + UUID.randomUUID());
            event.put("durationSeconds", duration(context) / 1000L);
            event.put("completedAt", isoTime(System.currentTimeMillis()));
        } catch (Exception ignored) { return null; }
        reset(context);
        return event;
    }

    public static void restoreAlarmAfterBoot(Context context) {
        if (hasSession(context) && running(context) && "foco".equals(mode(context))) scheduleAlarm(context);
    }

    private static void scheduleAlarm(Context context) {
        if (!hasSession(context) || !running(context) || !"foco".equals(mode(context))) return;
        long remaining = Math.max(1_000L, duration(context) - elapsed(context));
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (manager == null) return;
        long trigger = SystemClock.elapsedRealtime() + remaining;
        PendingIntent alarm = alarmIntent(context, token(context));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) manager.setAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, trigger, alarm);
        else manager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, trigger, alarm);
    }

    private static void cancelAlarm(Context context) {
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (manager != null) manager.cancel(alarmIntent(context, token(context)));
    }

    private static PendingIntent alarmIntent(Context context, String focusToken) {
        Intent intent = new Intent(context, FocusCompletionReceiver.class)
            .setAction(FocusCompletionReceiver.ACTION_FOCUS_COMPLETE).putExtra(FocusCompletionReceiver.EXTRA_TOKEN, focusToken);
        return PendingIntent.getBroadcast(context, 49025, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static String isoTime(long millis) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        format.setTimeZone(TimeZone.getTimeZone("UTC"));
        return format.format(new Date(millis));
    }
}
