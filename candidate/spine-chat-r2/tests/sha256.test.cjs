'use strict';
const test=require('node:test');const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');const sha=require('../runtime/sha256.js');
test('SHA-256 standard vector and UTF-8 agree with independent Node crypto',()=>{
 assert.equal(sha('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
 for(const s of ['', 'a'.repeat(55),'a'.repeat(56),'a'.repeat(64),'a'.repeat(1000000),'blåbær 🌿 \ud800',JSON.stringify({x:'linje\nø',version:42})])
  assert.equal(sha(s),createHash('sha256').update(s,'utf8').digest('hex'));
});
