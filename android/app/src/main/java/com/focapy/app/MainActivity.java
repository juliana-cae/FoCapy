package com.focapy.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private boolean shieldedFocusActive = false;
    private String pendingWidgetAction;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(FocusScreenPlugin.class);
        registerPlugin(DevAuthPlugin.class);
        super.onCreate(savedInstanceState);
        receiveWidgetAction(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        receiveWidgetAction(intent);
    }

    private void receiveWidgetAction(Intent intent) {
        if (!FocapyWidgetProvider.ACTION_WIDGET.equals(intent.getAction())) return;
        String action = intent.getStringExtra(FocapyWidgetProvider.EXTRA_WIDGET_ACTION);
        if (!FocapyWidgetProvider.ACTION_FOCUS.equals(action)
            && !FocapyWidgetProvider.ACTION_STOPWATCH.equals(action)
            && !FocapyWidgetProvider.ACTION_TASKS.equals(action)) return;
        pendingWidgetAction = action;
        dispatchWidgetAction();
    }

    @Override
    protected void onResume() {
        super.onResume();
        dispatchWidgetAction();
    }

    private void dispatchWidgetAction() {
        if (pendingWidgetAction == null || bridge == null || bridge.getWebView() == null) return;
        final String action = pendingWidgetAction;
        bridge.getWebView().postDelayed(() -> bridge.getWebView().evaluateJavascript(
            "window.focapyWidgetAction=" + jsString(action) + ";window.dispatchEvent(new CustomEvent('focapy-widget-action',{detail:" + jsString(action) + "}));", null
        ), 350);
        pendingWidgetAction = null;
    }

    private String jsString(String value) {
        return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'";
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
