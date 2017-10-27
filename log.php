<?php
  $data = array();
  $data['HTTP_USER_AGENT']=$_SERVER['HTTP_USER_AGENT'];
  $data['REMOTE_ADDR']=$_SERVER['REMOTE_ADDR'];
  $data['REQUEST_URI']=$_SERVER['REQUEST_URI'];
  $json = json_encode($data);
  openlog("MetadynView", LOG_NDELAY, LOG_LOCAL0);
  $result = syslog(LOG_INFO, $json);
  closelog()
?>
<html>
  <head></head>
  <body>
    <?= $json ?>
    <?= $result ?>
  </body>
</html>
