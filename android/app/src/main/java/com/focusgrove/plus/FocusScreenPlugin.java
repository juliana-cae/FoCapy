package com.focapy.app;

import android.view.WindowManager;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@CapacitorPlugin(name = "FocusScreen")
public class FocusScreenPlugin extends Plugin {
    @PluginMethod
    public void setFocusState(PluginCall call) {
        boolean active = call.getBoolean("active", false);
        boolean shielded = call.getBoolean("shielded", false);

        getActivity().runOnUiThread(() -> {
            if (active) {
                getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            } else {
                getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
            ((MainActivity) getActivity()).setShieldedFocusActive(active && shielded);
            call.resolve();
        });
    }
}
