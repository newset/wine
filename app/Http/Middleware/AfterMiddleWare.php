<?php

namespace App\Http\Middleware;

use Closure;
use DB;

class AfterMiddleWare
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!env("APP_DEBUG")) return $next($request);

        DB::enableQueryLog();
        $response = $next($request);

        $queries = DB::getQueryLog();
        $log_data = [];

        $log_data[] = date("Y-m-d H:i:s");
        foreach($queries as $query) {
            array_walk($query['bindings'],function(&$val){
                if(is_integer($val)) $val = intval($val);
                if(is_string($val)) $val = "'".$val."'";
            });
            $log_data[] = '[' . $query['time'] . "]\t" . vsprintf(str_replace('?', '%s', $query['query']), $query['bindings']);
        }
        $log_data[] = str_repeat('-',50);
        $log_data[] = "\r\n";

        if(count($queries) > 0){
            $log_file = fopen(storage_path('logs/query-'.date('Y-m-d').'.log'), 'a+');
            fwrite($log_file, implode("\r\n",$log_data));
            fclose($log_file);
        }

        return $response;
    }
}
