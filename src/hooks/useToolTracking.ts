import { useEffect } from 'react';
import { useRecentTools } from './useRecentTools';
import { supabase } from '@/lib/supabaseClient';

export const useToolTracking = (toolName: string) => {
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    // Add to recent tools when component mounts
    addRecentTool(toolName);

    // Track tool usage in Supabase
    const trackToolUsage = async () => {
      try {
        // Get device info
        const userAgent = navigator.userAgent;
        
        // Detect if it's a bot
        const botPatterns = [
          /bot/i, /crawler/i, /spider/i, /crawling/i, /slurp/i,
          /mediapartners/i, /apis-google/i, /headless/i, /phantom/i,
          /lighthouse/i, /gtmetrix/i, /pingdom/i, /uptime/i
        ];
        const isBot = botPatterns.some(pattern => pattern.test(userAgent));
        
        let device = 'Desktop';
        if (/mobile/i.test(userAgent)) {
          device = 'Mobile';
        } else if (/tablet/i.test(userAgent)) {
          device = 'Tablet';
        }

        // Get browser info
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        else if (userAgent.includes('Opera')) browser = 'Opera';

        // Get or create session ID
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          sessionStorage.setItem('session_id', sessionId);
        }

        // Get IP and location from free API
        let ip = null;
        let country = null;
        let city = null;

        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const data = await response.json();
            ip = data.ip;
            country = data.country_name;
            city = data.city;
          }
        } catch (error) {
          console.error('Error fetching IP info:', error);
        }

        // Insert tool usage data into Supabase
        const toolUsageData = {
          tool_name: toolName,
          device,
          browser,
          country,
          city,
          ip,
          user_agent: userAgent,
          session_id: sessionId,
          is_bot: isBot,
        };

        const { error } = await supabase.from('tool_usage').insert(toolUsageData);

        if (error) {
          console.error('Error tracking tool usage:', error);
        }
      } catch (error) {
        console.error('Error in tool usage tracking:', error);
      }
    };

    trackToolUsage();
  }, [toolName, addRecentTool]);
};
