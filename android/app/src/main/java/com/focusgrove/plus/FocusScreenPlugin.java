package com.focapy.app;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
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
        String externalAppLock = call.getString("externalAppLock", "none");

        getActivity().runOnUiThread(() -> {
            if (active) getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            ((MainActivity) getActivity()).setShieldedFocusActive(active && shielded);

            try {
                if (!active || "none".equals(externalAppLock)) {
                    getActivity().stopLockTask();
                } else if ("pin".equals(externalAppLock)) {
                    // Android displays its own confirmation when screen pinning is not pre-authorized.
                    getActivity().startLockTask();
                } else if ("kiosk".equals(externalAppLock)) {
                    DevicePolicyManager policy = (DevicePolicyManager) getContext().getSystemService(Context.DEVICE_POLICY_SERVICE);
                    String packageName = getContext().getPackageName();
                    if (policy == null || !policy.isDeviceOwnerApp(packageName)) {
                        call.reject("O Quiosque gerenciado exige que o FoCapy seja configurado como Device Owner neste aparelho.");
                        return;
                    }
                    ComponentName admin = new ComponentName(getContext(), FocusDeviceAdminReceiver.class);
                    policy.setLockTaskPackages(admin, new String[]{packageName});
                    getActivity().startLockTask();
                }
                call.resolve();
            } catch (IllegalStateException | SecurityException error) {
                call.reject("Não foi possível ativar o bloqueio do Android. Verifique a configuração do modo escolhido.", error);
            }
        });
    }
}
