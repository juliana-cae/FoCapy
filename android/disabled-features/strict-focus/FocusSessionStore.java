package com.focapy.app;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/** Native durable state: independent from the Capacitor Activity/WebView lifecycle. */
public final class FocusSessionStore {
    private static final String PREFS = "strict_focus_session";
    private static final String ACTIVE = "focusActive";
    private static final String START = "focusStartTime";
    private static final String END = "focusEndTime";
    private static final String ALLOWED = "allowedPackages";
    private final SharedPreferences prefs;
    public FocusSessionStore(Context context) { prefs=context.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }
    public boolean isActive() { return prefs.getBoolean(ACTIVE,false) && getEndTime()>System.currentTimeMillis(); }
    public long getEndTime() { return prefs.getLong(END,0); }
    public Set<String> allowedPackages() { return new HashSet<>(prefs.getStringSet(ALLOWED,new HashSet<>())); }
    public void start(long startTime,long endTime,Set<String> allowed) { prefs.edit().putBoolean(ACTIVE,true).putLong(START,startTime).putLong(END,endTime).putStringSet(ALLOWED,new HashSet<>(allowed)).apply(); }
    public void clear() { prefs.edit().clear().apply(); }
    public boolean clearIfExpired() { if(prefs.getBoolean(ACTIVE,false)&&getEndTime()<=System.currentTimeMillis()){clear();return true;} return false; }
}
