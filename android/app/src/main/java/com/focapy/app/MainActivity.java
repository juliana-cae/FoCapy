package com.focapy.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private boolean shieldedFocusActive = false;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(FocusScreenPlugin.class);
        registerPlugin(DevAuthPlugin.class);
        registerPlugin(TaskWidgetPlugin.class);
        super.onCreate(savedInstanceState);
    }

    public void setShieldedFocusActive(boolean active) {
        shieldedFocusActive = active;
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (shieldedFocusActive) {
            bridge.getWebView().evaluateJavascript(
                "window.focapyShieldBackWarning && window.focapyShieldBackWarning();", null
            );
            return;
        }
        super.onBackPressed();
    }
}
