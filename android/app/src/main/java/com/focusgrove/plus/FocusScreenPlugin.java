package com.focapy.app;

import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.view.WindowManager;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CapacitorPlugin(name = "FocusScreen")
public class FocusScreenPlugin extends Plugin {
 @PluginMethod public void setFocusState(PluginCall call){boolean active=call.getBoolean("active",false);boolean shielded=call.getBoolean("shielded",false);long endTime=call.getLong("focusEndTime",0L);Set<String> allowed=new HashSet<>(); FocusSessionStore store=new FocusSessionStore(getContext()); if(active&&endTime>System.currentTimeMillis()){if(!isAccessibilityEnabled()) {call.reject("Para impedir a abertura de outros aplicativos, ative a Proteção de Foco nas configurações de acessibilidade.");return;}store.start(System.currentTimeMillis(),endTime,allowed);}else store.clear();getActivity().runOnUiThread(()->{if(active)getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);((MainActivity)getActivity()).setShieldedFocusActive(active&&shielded);call.resolve();});}
 @PluginMethod public void openAccessibilitySettings(PluginCall call){Intent i=new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);getContext().startActivity(i);call.resolve();}
 @PluginMethod public void isAccessibilityEnabled(PluginCall call){com.getcapacitor.JSObject result=new com.getcapacitor.JSObject();result.put("enabled",isAccessibilityEnabled());call.resolve(result);}
 private boolean isAccessibilityEnabled(){String services=Settings.Secure.getString(getContext().getContentResolver(),Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);return services!=null&&services.toLowerCase().contains(getContext().getPackageName().toLowerCase()+"/"+FocusAccessibilityService.class.getName().toLowerCase());}
}
