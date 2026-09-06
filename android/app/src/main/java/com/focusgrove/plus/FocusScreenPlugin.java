package com.focapy.app;

import android.view.WindowManager;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

/** Keeps FoCapy awake and optionally pins the FoCapy screen during an active Blindado session. */
@CapacitorPlugin(name = "FocusScreen")
public class FocusScreenPlugin extends Plugin {
    @PluginMethod
    public void setFocusState(PluginCall call) {
        boolean active = call.getBoolean("active", false);
        boolean shielded = call.getBoolean("shielded", false);
        boolean lockScreen = call.getBoolean("lockScreen", false);
        getActivity().runOnUiThread(() -> {
            if (active) {
                getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                if (lockScreen) {
                    getActivity().startLockTask();
                } else {
                    getActivity().stopLockTask();
                }
            } else {
                getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                getActivity().stopLockTask();
            }
            ((MainActivity) getActivity()).setShieldedFocusActive(active && shielded);
            call.resolve();
        });
    }
}
