package com.focapy.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.SystemClock;

public final class FocapyWidgetState {
    private static final String PREFS = "focapy_widget_state";
    private static final String KEY_MODE = "mode";
    private static final String KEY_RUNNING = "running";
    private static final String KEY_STARTED_AT = "started_at";
    private static final String KEY_ELAPSED = "elapsed";

    private FocapyWidgetState() {}

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static void start(Context context, String mode) {
        SharedPreferences p = prefs(context);
        long elapsed = p.getLong(KEY_ELAPSED, 0L);
        p.edit().putString(KEY_MODE, mode).putLong(KEY_STARTED_AT, SystemClock.elapsedRealtime())
            .putLong(KEY_ELAPSED, elapsed).putBoolean(KEY_RUNNING, true).apply();
    }

    public static void pause(Context context) {
        SharedPreferences p = prefs(context);
        if (!p.getBoolean(KEY_RUNNING, false)) return;
        long elapsed = p.getLong(KEY_ELAPSED, 0L) + (SystemClock.elapsedRealtime() - p.getLong(KEY_STARTED_AT, SystemClock.elapsedRealtime()));
        p.edit().putLong(KEY_ELAPSED, elapsed).putBoolean(KEY_RUNNING, false).apply();
    }

    public static void reset(Context context) {
        prefs(context).edit().clear().apply();
    }

    public static boolean running(Context context) { return prefs(context).getBoolean(KEY_RUNNING, false); }
    public static String mode(Context context) { return prefs(context).getString(KEY_MODE, "foco"); }
    public static long elapsed(Context context) {
        SharedPreferences p = prefs(context);
        long elapsed = p.getLong(KEY_ELAPSED, 0L);
        return p.getBoolean(KEY_RUNNING, false) ? elapsed + (SystemClock.elapsedRealtime() - p.getLong(KEY_STARTED_AT, SystemClock.elapsedRealtime())) : elapsed;
    }
    public static long chronometerBase(Context context) { return SystemClock.elapsedRealtime() - elapsed(context); }
}
