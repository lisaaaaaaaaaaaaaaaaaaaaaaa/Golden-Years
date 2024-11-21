import { useState, useEffect, useCallback } from "react";
import { perf, trace } from "firebase/performance";
import { InteractionManager } from "react-native";

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  attributes?: Record<string, string>;
}

interface PerformanceTrace {
  trace: any;
  start: () => void;
  stop: () => void;
  putAttribute: (key: string, value: string) => void;
  removeAttribute: (key: string) => void;
  getAttributes: () => Record<string, string>;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const startTrace = useCallback((name: string): PerformanceTrace => {
    const newTrace = trace(perf, name);
    
    return {
      trace: newTrace,
      start: () => {
        newTrace.start();
        setMetrics(prev => [...prev, {
          name,
          startTime: Date.now(),
        }]);
      },
      stop: () => {
        newTrace.stop();
        setMetrics(prev => prev.map(metric => 
          metric.name === name && !metric.endTime
            ? {
                ...metric,
                endTime: Date.now(),
                duration: Date.now() - metric.startTime,
              }
            : metric
        ));
      },
      putAttribute: (key: string, value: string) => {
        newTrace.putAttribute(key, value);
        setMetrics(prev => prev.map(metric => 
          metric.name === name
            ? {
                ...metric,
                attributes: { ...(metric.attributes || {}), [key]: value },
              }
            : metric
        ));
      },
      removeAttribute: (key: string) => {
        newTrace.removeAttribute(key);
        setMetrics(prev => prev.map(metric => {
          if (metric.name === name && metric.attributes) {
            const { [key]: _, ...rest } = metric.attributes;
            return { ...metric, attributes: rest };
          }
          return metric;
        }));
      },
      getAttributes: () => newTrace.getAttributes(),
    };
  }, []);

  const measureInteraction = useCallback((name: string, interaction: () => Promise<void>) => {
    const traceObj = startTrace(name);
    traceObj.start();

    return InteractionManager.runAfterInteractions(async () => {
      try {
        await interaction();
      } finally {
        traceObj.stop();
      }
    });
  }, [startTrace]);

  const clearMetrics = () => {
    setMetrics([]);
  };

  const getAverageMetric = (name: string) => {
    const relevantMetrics = metrics.filter(
      m => m.name === name && m.duration !== undefined
    );
    
    if (relevantMetrics.length === 0) return 0;
    
    const total = relevantMetrics.reduce(
      (sum, metric) => sum + (metric.duration || 0),
      0
    );
    return total / relevantMetrics.length;
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  return {
    metrics,
    startTrace,
    measureInteraction,
    clearMetrics,
    getAverageMetric,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  };
};
