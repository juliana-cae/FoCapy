package com.focapy.app;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.telecom.TelecomManager;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import java.util.HashSet;
import java.util.Set;

/** Blocks interaction above a forbidden foreground app while a persisted focus session is active. */
public class FocusAccessibilityService extends AccessibilityService {
  private FocusSessionStore store; private WindowManager wm; private View overlay; private String lastPackage=""; private long lastEventAt=0; private boolean focusForeground=false;
  @Override public void onServiceConnected(){ super.onServiceConnected(); store=new FocusSessionStore(this); wm=(WindowManager)getSystemService(WINDOW_SERVICE); AccessibilityServiceInfo i=getServiceInfo(); i.eventTypes=AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED|AccessibilityEvent.TYPE_WINDOWS_CHANGED; i.feedbackType=AccessibilityServiceInfo.FEEDBACK_GENERIC; i.notificationTimeout=100; setServiceInfo(i); checkExpiry(); }
  @Override public void onAccessibilityEvent(AccessibilityEvent event){ if(event==null||!store.isActive()){removeBlockingOverlay();return;} if(checkExpiry())return; CharSequence raw=event.getPackageName(); if(raw==null)return; String pkg=raw.toString(); if(pkg.isEmpty())return; long now=System.currentTimeMillis(); if(pkg.equals(lastPackage)&&now-lastEventAt<250)return; lastPackage=pkg;lastEventAt=now;
    if("com.android.systemui".equals(pkg)){ dismissNotifications(); showBlockingOverlay("Modo foco ativo", "Volte ao que você estava fazendo."); return; }
    if(getPackageName().equals(pkg))focusForeground=true; else if(!isCurrentIme(pkg))focusForeground=false;
    if(isPackageAllowed(pkg)){removeBlockingOverlay();return;} showBlockingOverlay("Modo foco ativo", appLabel(pkg)+" está bloqueado durante sua sessão."); }
  @Override public void onInterrupt(){}
  @Override public boolean onUnbind(Intent intent){ removeBlockingOverlay(); return super.onUnbind(intent); }
  private boolean checkExpiry(){if(store.clearIfExpired()){removeBlockingOverlay();return true;}return false;}
  private boolean isPackageAllowed(String pkg){if(getPackageName().equals(pkg)||store.allowedPackages().contains(pkg)||isEssentialCallPackage(pkg)||isCurrentIme(pkg)&&focusForeground)return true;return false;}
  private boolean isCurrentIme(String pkg){String ime=android.provider.Settings.Secure.getString(getContentResolver(),android.provider.Settings.Secure.DEFAULT_INPUT_METHOD);return ime!=null&&ime.startsWith(pkg+"/");}
  private boolean isEssentialCallPackage(String pkg){TelecomManager tm=getSystemService(TelecomManager.class); if(tm!=null&&tm.isInCall())return pkg.equals(tm.getDefaultDialerPackage())||pkg.contains("incall")||pkg.contains("telecom"); return false;}
  private String appLabel(String pkg){try{return getPackageManager().getApplicationLabel(getPackageManager().getApplicationInfo(pkg,0)).toString();}catch(Exception e){return "Este aplicativo";}}
  private void dismissNotifications(){if(Build.VERSION.SDK_INT>=31)performGlobalAction(GLOBAL_ACTION_DISMISS_NOTIFICATION_SHADE);else performGlobalAction(GLOBAL_ACTION_BACK);}
  private void showBlockingOverlay(String title,String body){if(overlay!=null){updateBlockingOverlay(title,body);return;} LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setGravity(Gravity.CENTER);root.setPadding(48,48,48,48);root.setBackgroundColor(Color.rgb(21,56,46)); TextView h=new TextView(this);h.setText(title);h.setTextSize(28);h.setTextColor(Color.WHITE);TextView text=new TextView(this);text.setText(body+"\n\nTempo restante: "+remaining());text.setTextSize(18);text.setTextColor(Color.rgb(237,230,212));text.setPadding(0,22,0,30); Button back=new Button(this);back.setText("Voltar ao foco");back.setOnClickListener(v->returnToFocus());root.addView(h);root.addView(text);root.addView(back);root.setTag(text); overlay=root;WindowManager.LayoutParams p=new WindowManager.LayoutParams(WindowManager.LayoutParams.MATCH_PARENT,WindowManager.LayoutParams.MATCH_PARENT,WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,android.graphics.PixelFormat.TRANSLUCENT);wm.addView(overlay,p);overlay.postDelayed(new Runnable(){public void run(){if(overlay!=null&&store.isActive()){updateBlockingOverlay(title,body);overlay.postDelayed(this,1000);}}},1000);}
  private void updateBlockingOverlay(String title,String body){if(overlay==null)return;((TextView)overlay.getTag()).setText(body+"\n\nTempo restante: "+remaining());}
  private String remaining(){long sec=Math.max(0,(store.getEndTime()-System.currentTimeMillis())/1000);return String.format(java.util.Locale.getDefault(),"%02d:%02d",sec/60,sec%60);}
  private void removeBlockingOverlay(){if(overlay!=null){try{wm.removeView(overlay);}catch(Exception ignored){} overlay=null;}}
  private void returnToFocus(){Intent i=getPackageManager().getLaunchIntentForPackage(getPackageName());if(i!=null){i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_SINGLE_TOP);startActivity(i);}removeBlockingOverlay();}
}
