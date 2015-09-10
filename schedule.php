<div class="heading">Upcoming Concerts</div>
<ul class="schedule">
  <li ng-repeat="event in list.upcoming" scroll-date="{{event.dateString}}">
    <div class="eventStart" ng-bind="parseTime(event)"></div>
    <div class="eventName" ng-bind="event.summary"></div>
    <div class="eventLocation" ng-bind="event.location"></div>
    <div class="eventDescription" ng-bind="describeEvent(event)"></div>
    <div class="leftpad">
      "<a ng-href="{{getLink(event)}}" ng-show="getLink(event)">link to more details...</a>
    </div>
  </li>
</ul>
<div class="heading extraTop">Archived Concerts</div>
<ul class="schedule">
  <li ng-repeat="event in list.archive | reverse" scroll-date="{{event.dateString}}">
    <div class="eventStart" ng-bind="parseTime(event)"></div>
    <div class="eventName" ng-bind="event.summary"></div>
    <div class="eventLocation" ng-bind="event.location"></div>
    <div class="eventDescription" ng-bind="describeEvent(event)"></div>
    <div class="leftpad">
      "<a ng-href="{{getLink(event)}}" ng-show="getLink(event)">link to more details...</a>
    </div>
  </li>
</ul>