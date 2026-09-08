package com.focapy.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.SystemClock;

public final class FocapyWidgetState {
    public static final long FOCUS_DURATION_MS = 25L * 60L * 1000L;
    private static final String PREFS = "focapy_widget_state", MODE = "mode", RUNNING = "running", STARTED = "started", ELAPSED = "elapsed";
    private FocapyWidgetState() {}
    private static SharedPreferences prefs(Context c) { return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }
    public static void start(Context c, String mode) { prefs(c).edit().putString(MODE, mode).putLong(STARTED, SystemClock.elapsedRealtime()).putLong(ELAPSED, 0L).putBoolean(RUNNING, true).apply(); }
    public static void pause(Context c) { SharedPreferences p=prefs(c); if(!p.getBoolean(RUNNING,false)) return; p.edit().putLong(ELAPSED, elapsed(c)).putBoolean(RUNNING,false).apply(); }
    public static void reset(Context c) { prefs(c).edit().clear().apply(); }
    public static boolean running(Context c) { return prefs(c).getBoolean(RUNNING,false); }
    public static String mode(Context c) { return prefs(c).getString(MODE,"foco"); }
    public static long elapsed(Context c) { SharedPreferences p=prefs(c); long base=p.getLong(ELAPSED,0L); return p.getBoolean(RUNNING,false)?base+Math.max(0,SystemClock.elapsedRealtime()-p.getLong(STARTED,SystemClock.elapsedRealtime())):base; }
    public static boolean hasSession(Context c) { return elapsed(c)>0 || running(c); }
    public static long timerBase(Context c) { long elapsed=elapsed(c); return "foco".equals(mode(c))?SystemClock.elapsedRealtime()+Math.max(0,FOCUS_DURATION_MS-elapsed):SystemClock.elapsedRealtime()-elapsed; }
    public static boolean isFocusFinished(Context c) { return "foco".equals(mode(c)) && elapsed(c)>=FOCUS_DURATION_MS; }
}
