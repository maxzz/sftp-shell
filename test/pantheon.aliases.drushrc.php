<?php
  /**
   * Pantheon drush alias file, to be placed in your ~/.drush directory or the aliases
   * directory of your local Drush home. Once it's in place, clear drush cache:
   *
   * drush cc drush
   *
   * To see all your available aliases:
   *
   * drush sa
   *
   * See http://helpdesk.getpantheon.com/customer/portal/articles/411388 for details.
   */

  $aliases['hid-global.reg-cors'] = array(
    'uri' => 'reg-cors-hid-global.pantheonsite.io',
    'db-url' => 'mysql://pantheon:fc688dd7c85f4b959d7e3c63ae342c43@dbserver.reg-cors.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in:15851/pantheon',
    'db-allows-remote' => TRUE,
    'remote-host' => 'appserver.reg-cors.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in',
    'remote-user' => 'reg-cors.b82019b8-481a-44c8-88da-be3d2af3cfbb',
    'ssh-options' => '-p 2222 -o "AddressFamily inet"',
    'path-aliases' => array(
      '%files' => 'files',
      '%drush-script' => 'drush',
     ),
  );
  $aliases['hid-global.d8migrate'] = array(
    'uri' => 'd8migrate-hid-global.pantheonsite.io',
    'db-url' => 'mysql://pantheon:7d91bc1489fb4b0399c99d2a23eebf4c@dbserver.d8migrate.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in:14520/pantheon',
    'db-allows-remote' => TRUE,
    'remote-host' => 'appserver.d8migrate.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in',
    'remote-user' => 'd8migrate.b82019b8-481a-44c8-88da-be3d2af3cfbb',
    'ssh-options' => '-p 2222 -o "AddressFamily inet"',
    'path-aliases' => array(
      '%files' => 'files',
      '%drush-script' => 'drush',
     ),
  );
  $aliases['hid-global.test'] = array(
    'uri' => 'test.hidglobal.mx',
    'db-url' => 'mysql://pantheon:d83e3dbd511f4594bb6ee24818f0c4fb@dbserver.test.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in:11047/pantheon',
    'db-allows-remote' => TRUE,
    'remote-host' => 'appserver.test.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in',
    'remote-user' => 'test.b82019b8-481a-44c8-88da-be3d2af3cfbb',
    'ssh-options' => '-p 2222 -o "AddressFamily inet"',
    'path-aliases' => array(
      '%files' => 'files',
      '%drush-script' => 'drush',
     ),
  );
  $aliases['hid-global.sf-sandbox'] = array(
    'uri' => 'sf-sandbox-hid-global.pantheonsite.io',
    'db-url' => 'mysql://pantheon:91eaf30f8f7d4c6cac47871532f976c9@dbserver.sf-sandbox.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in:12544/pantheon',
    'db-allows-remote' => TRUE,
    'remote-host' => 'appserver.sf-sandbox.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in',
    'remote-user' => 'sf-sandbox.b82019b8-481a-44c8-88da-be3d2af3cfbb',
    'ssh-options' => '-p 2222 -o "AddressFamily inet"',
    'path-aliases' => array(
      '%files' => 'files',
      '%drush-script' => 'drush',
     ),
  );
  $aliases['hid-global.lingotek'] = array(
    'uri' => 'lingotek-hid-global.pantheonsite.io',
    'db-url' => 'mysql://pantheon:48cbdd65155e4cd18de616ce1c8d73a5@dbserver.lingotek.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in:15433/pantheon',
    'db-allows-remote' => TRUE,
    'remote-host' => 'appserver.lingotek.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in',
    'remote-user' => 'lingotek.b82019b8-481a-44c8-88da-be3d2af3cfbb',
    'ssh-options' => '-p 2222 -o "AddressFamily inet"',
    'path-aliases' => array(
      '%files' => 'files',
      '%drush-script' => 'drush',
     ),
  );
  $aliases['hid-global.agile'] = array(
    'uri' => 'agile-hid-global.pantheonsite.io',
    'db-url' => 'mysql://pantheon:183df4d52af64206896e20699ce04b55@dbserver.agile.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in:17692/pantheon',
    'db-allows-remote' => TRUE,
    'remote-host' => 'appserver.agile.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in',
    'remote-user' => 'agile.b82019b8-481a-44c8-88da-be3d2af3cfbb',
    'ssh-options' => '-p 2222 -o "AddressFamily inet"',
    'path-aliases' => array(
      '%files' => 'files',
      '%drush-script' => 'drush',
     ),
  );
  $aliases['hid-global.dev'] = array(
    'uri' => 'dev.hidglobal.kr',
    'db-url' => 'mysql://pantheon:84d19d22561643f2aa003c54fc0290da@dbserver.dev.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in:10511/pantheon',
    'db-allows-remote' => TRUE,
    'remote-host' => 'appserver.dev.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in',
    'remote-user' => 'dev.b82019b8-481a-44c8-88da-be3d2af3cfbb',
    'ssh-options' => '-p 2222 -o "AddressFamily inet"',
    'path-aliases' => array(
      '%files' => 'files',
      '%drush-script' => 'drush',
     ),
  );
  $aliases['hid-global.live'] = array(
    'uri' => 'hidglobal.jp',
    'db-url' => 'mysql://pantheon:4237b7a49b6a4014bd5bfcc10248283c@dbserver.live.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in:10314/pantheon',
    'db-allows-remote' => TRUE,
    'remote-host' => 'appserver.live.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in',
    'remote-user' => 'live.b82019b8-481a-44c8-88da-be3d2af3cfbb',
    'ssh-options' => '-p 2222 -o "AddressFamily inet"',
    'path-aliases' => array(
      '%files' => 'files',
      '%drush-script' => 'drush',
     ),
  );
