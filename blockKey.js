// ==UserScript==
// @name         KeyLoL Girlfriend Shield
// @namespace    http://tampermonkey.net/
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/0.1.0/lodash.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @version      0.0.1
// @description  其乐狗粮屏蔽器
// @author       PigeonJimmy
// @match        https://keylol.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';
  //与元数据块中的@grant值相对应，功能是生成一个style样式
  GM_addStyle(
    `
    .gf-tool-modal {
        display: none;
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        width: 500px;
        border: 2px solid #eee;
        padding: 10px;
        background: #fff;
        border-radius: 4px;
    }
    
    .gf-tool-modal h2 {
        padding: 20px;
    }

    .gf-tool-body {
        display: flex;
        padding: 20px;
        justify-content: space-between;
    }

    .gf-tool-body input {
        border: 1px solid #eee;
        border-radius: 4px;
        width:60%
    }

    .gf-tool-body span {
        width:40%
    }

    .btn-box {
        display: flex;
        justify-content: space-between;
        padding: 20px;
    }

    .btn-box a {
        width: 45%;
        padding: 5px;
        border-radius: 4px;
        text-align: center;
    }

    .btn-box a:hover {
        text-decoration:none;
    }

    .btn-box .primary {
        color: #fff;
        background: #40a9ff;
        border-color: #40a9ff;
    }

    .btn-box .primary:hover {
        color: #fff;
        background: #1d7bc7;
        border-color: #1d7bc7;
    }

    .btn-box .close {
        color: #000;
        border: 1px solid #eee;
    }

    .btn-box .close:hover {
        color: #000;
        border-color: #1d7bc7;
    }`
  );
  let storageGFKey = localStorage.getItem('girlfriendKey');
  let keywords = storageGFKey
    ? storageGFKey
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s)
    : ['女朋友'];
  let change_my_key = () => {
    keywords = $('#GFbox')
      .val()
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);
    localStorage.setItem('girlfriendKey', $('#GFbox').val());
    let uncomfortableText = document.querySelectorAll('[id^="pid"]');

    uncomfortableText.forEach((item) => {
      let staderDiv = item.summary.split('pid')[1];
      let formIddemo = document.getElementById(`postmessage_${staderDiv}`);
      // 关键词屏蔽
      for (let i = 0; i < keywords.length; i++) {
        if (
          keywords[i] != '' &&
          item.querySelector('.t_f').innerHTML.indexOf(keywords[i]) != -1
        ) {
          formIddemo.innerHTML = formIddemo.innerHTML.replace(
            keywords[i],
            '兄弟'
          );
        }
      }
    });
  };
  let globalChange = () => {
    if (RegExp(/\/f[0-9-]+|mod=forumdisplay/i).test(window.location.href)) {
      let threads = document.querySelectorAll('[id^="normalthread"]');

      let func = (thread) => {
        // 关键词屏蔽
        for (let i = 0; i < keywords.length; i++) {
          if (
            keywords[i] != '' &&
            thread.querySelector('a.xst').innerHTML.indexOf(keywords[i]) != -1
          )
            thread.innerHTML = thread.innerHTML.replace(keywords[i], '兄弟');
        }
      };

      threads.forEach(func);

      // 过滤新回复
      let addtbodyrow_old = addtbodyrow;
      window.addtbodyrow = (
        table,
        insertID,
        changename,
        separatorid,
        jsonval
      ) => {
        // 板块页面
        addtbodyrow_old(table, insertID, changename, separatorid, jsonval);
        if (changename[0] == 'normalthread_' && !isUndefined(jsonval.tid)) {
          func(document.querySelector('#normalthread_' + jsonval.tid));
        }
      };

      // 过滤下一页
      document
        .querySelector('#threadlisttableid')
        .parentNode.addEventListener('DOMNodeInserted', (event) => {
          if (
            event.srcElement.nodeType == 1 &&
            RegExp(/normalthread_\d+/i).test(
              event.srcElement.getAttribute('id')
            ) &&
            !event.srcElement.classList.contains('newthread')
          ) {
            func(event.srcElement);
          }
        });
    } else if (
      RegExp(/\/t[0-9-]+|mod=viewthread/i).test(window.location.href)
    ) {
      // 帖子页面
      let posts = document.querySelectorAll('[id^="post_"]');

      let userAnwsers = document.querySelectorAll('[id^="pid"]');

      userAnwsers.forEach((userAnwser) => {
        let staderDiv = userAnwser.summary.split('pid')[1];
        let formIddemo = document.getElementById(`postmessage_${staderDiv}`);
        // 关键词屏蔽
        for (let i = 0; i < keywords.length; i++) {
          if (
            keywords[i] != '' &&
            userAnwser.querySelector('.t_f').innerHTML.indexOf(keywords[i]) !=
              -1
          ) {
            formIddemo.innerHTML = formIddemo.innerHTML.replace(
              keywords[i],
              '兄弟'
            );
          }
        }
      });
    } else if (RegExp(/mod=guide/i).test(window.location.href)) {
      // 导读页
      let threads = document.querySelectorAll('[id^="normalthread"]');

      threads.forEach((thread) => {
        // 关键词屏蔽
        for (let i = 0; i < keywords.length; i++) {
          if (
            keywords[i] != '' &&
            thread.querySelector('a.xst').innerHTML.indexOf(keywords[i]) != -1
          )
            thread.innerHTML = thread.innerHTML.replace(keywords[i], '兄弟');
        }
      });
    } else if (window.location.pathname == '/') {
      // 首页
      let threads = document.querySelectorAll('.dxb_bc ol li');

      threads.forEach((thread) => {
        for (let i = 0; i < keywords.length; i++) {
          if (
            keywords[i] != '' &&
            thread.querySelector('li > a:last-child').innerHTML.indexOf(keywords[i]) != -1
          )
            thread.innerHTML = thread.innerHTML.replace(keywords[i], '兄弟');
        }
      });
    }
  };
  var settingBox = `
    <div class="gf-tool-modal">
        <h2 class="gf-tool-title">狗粮屏蔽！！！！</h2>
        <div class="gf-tool-body">
            <span>关键词(用英文逗号区分）：</span>
            <input type="text" id='GFbox'>
        </div>
        <div class="btn-box">
            <a href="javascript:void(0);" class="primary" id='changeKeyBtn'>保存</a>
            <a href="javascript:void(0);" class="close" id='gfClose'>关闭</a>
        </div>
    </div>`;

  $('#wp').append(settingBox);
  globalChange();
  // 添加设置按钮
  document
    .querySelector('#nav-user-action-bar > ul')
    .insertAdjacentHTML(
      'beforeEnd',
      '<li><a class="btn btn-user-action" href="javascript:" id="goout_gf_key_config"> 关闭狗粮 </a></li>'
    );
  document
    .querySelector('#goout_gf_key_config')
    .addEventListener('click', () => {
      if (storageGFKey) {
        $('#GFbox').attr('value', storageGFKey);
      }
      $('.gf-tool-modal').css({ display: 'block' });
    });
  $('#changeKeyBtn').click(function () {
    change_my_key();
    globalChange();
    $('.gf-tool-modal').css({ display: 'none' });
  });
  $('#gfClose').click(function () {
    $('.gf-tool-modal').css({ display: 'none' });
  });
})();
