/**
 * PyCon Panamá 2025 - Lógica del Formulario de Registro
 * @version 1.0.0
 */

(function () {
  'use strict';

  // ============================================
  // CONFIGURACIÓN
  // ============================================
  const CONFIG = {
    codeRenewalInterval: 180000, // 3 minutos
    storageKeys: {
      lastCode: 'pc25_last_code',
      lastEmail: 'pc25_last_email',
      lastName: 'pc25_last_name'
    }
  };

  // ============================================
  // ELEMENTOS DOM
  // ============================================
  const elements = {
    form: document.getElementById('pc25-form'),
    codeInput: document.getElementById('pc-code'),
    codeDisplay: document.getElementById('pc-code-display'),
    progressBar: document.getElementById('formProgress'),
    successMessage: document.getElementById('successMessage'),
    errorMessage: document.getElementById('errorMessage'),
    daysError: document.getElementById('days-error'),
    submitButton: null // Se inicializa después
  };

  // Verificar que el formulario existe
  if (!elements.form) {
    console.error('❌ Formulario no encontrado');
    return;
  }

  elements.submitButton = elements.form.querySelector('button[type="submit"]');

  // ============================================
  // GENERACIÓN DE CÓDIGO DE REGISTRO
  // ============================================
  const RegistrationCode = {
    timer: null,

    /**
     * Genera un código único de registro
     * Formato: PC25-YYYYMMDDHHMMSS-HEXRANDOM
     */
    generate() {
      const randomHex = [...crypto.getRandomValues(new Uint8Array(6))]
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

      const timestamp = new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, '')
        .slice(0, 14);

      return `PC25-${timestamp}-${randomHex}`;
    },

    /**
     * Actualiza el código en el input y display
     */
    set(code) {
      if (elements.codeInput) elements.codeInput.value = code;
      if (elements.codeDisplay) elements.codeDisplay.textContent = code;
    },

    /**
     * Inicializa el código y establece renovación automática
     */
    init() {
      const code = this.generate();
      this.set(code);

      // Renovar cada X minutos
      this.timer = setInterval(() => {
        const newCode = this.generate();
        this.set(newCode);
        console.log('🔄 Código renovado:', newCode);
      }, CONFIG.codeRenewalInterval);
    },

    /**
     * Detiene la renovación automática
     */
    stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };

  // ============================================
  // BARRA DE PROGRESO
  // ============================================
  const ProgressBar = {
    /**
     * Obtiene todos los campos requeridos
     */
    getRequiredFields() {
      return elements.form.querySelectorAll('[required]');
    },

    /**
     * Verifica si un campo está completado
     */
    isFieldComplete(field) {
      if (field.type === 'checkbox') {
        // Para checkboxes de días, verificar si al menos uno está marcado
        if (field.name === 'days' || field.dataset.origName === 'days') {
          const dayCheckboxes = elements.form.querySelectorAll('input[name="days"], input[data-orig-name="days"]');
          return Array.from(dayCheckboxes).some(cb => cb.checked);
        }
        return field.checked;
      }
      
      if (field.type === 'select-one') {
        return field.value !== '';
      }
      
      return field.value.trim() !== '';
    },

    /**
     * Calcula y actualiza el progreso
     */
    update() {
      if (!elements.progressBar) return;

      const requiredFields = this.getRequiredFields();
      let completedCount = 0;
      const processedDays = new Set();

      requiredFields.forEach(field => {
        // Evitar contar múltiples veces los checkboxes de días
        if (field.name === 'days' || field.dataset.origName === 'days') {
          if (!processedDays.has('days')) {
            if (this.isFieldComplete(field)) {
              completedCount++;
            }
            processedDays.add('days');
          }
        } else if (this.isFieldComplete(field)) {
          completedCount++;
        }
      });

      const totalRequired = requiredFields.length - Array.from(requiredFields)
        .filter(f => (f.name === 'days' || f.dataset.origName === 'days'))
        .length + 1; // Contar días como un solo campo

      const progress = (completedCount / totalRequired) * 100;
      elements.progressBar.style.width = `${Math.min(progress, 100)}%`;

      console.log(`📊 Progreso: ${completedCount}/${totalRequired} (${Math.round(progress)}%)`);
    }
  };

  // ============================================
  // VALIDACIÓN DE DÍAS
  // ============================================
  const DaysValidation = {
    /**
     * Obtiene todos los checkboxes de días
     */
    getCheckboxes() {
      return elements.form.querySelectorAll('input[name="days"], input[data-orig-name="days"]');
    },

    /**
     * Verifica si al menos un día está seleccionado
     */
    validate() {
      const checkboxes = this.getCheckboxes();
      const anyChecked = Array.from(checkboxes).some(cb => cb.checked);

      if (anyChecked) {
        // Limpiar errores
        checkboxes.forEach(cb => {
          cb.setCustomValidity('');
          cb.classList.remove('is-invalid');
        });
        if (elements.daysError) {
          elements.daysError.style.display = 'none';
        }
        return true;
      } else {
        // Mostrar error
        if (elements.daysError) {
          elements.daysError.style.display = 'block';
        }
        checkboxes.forEach(cb => {
          cb.classList.add('is-invalid');
        });
        return false;
      }
    },

    /**
     * Inicializa los listeners
     */
    init() {
      const checkboxes = this.getCheckboxes();
      checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          this.validate();
          ProgressBar.update();
        });
      });
    }
  };

  // ============================================
  // SERIALIZACIÓN DE CHECKBOXES
  // ============================================
  const CheckboxSerializer = {
    /**
     * Remueve el atributo name de los checkboxes y lo guarda en data-orig-name
     */
    detachNames() {
      const checkboxes = elements.form.querySelectorAll('input[type="checkbox"][name]');
      
      checkboxes.forEach(el => {
        // No modificar el checkbox de términos
        if (el.id === 'terms') return;

        if (!el.dataset.origName) {
          el.dataset.origName = el.getAttribute('name');
        }
        el.removeAttribute('name');
      });
    },

    /**
     * Crea o obtiene un campo hidden
     */
    ensureHiddenField(name) {
      let field = elements.form.querySelector(`input[type="hidden"][name="${name}"]`);
      
      if (!field) {
        field = document.createElement('input');
        field.type = 'hidden';
        field.name = name;
        elements.form.appendChild(field);
      }
      
      return field;
    },

    /**
     * Recolecta valores de checkboxes marcados
     */
    collectValues(origName) {
      const checkboxes = elements.form.querySelectorAll(`input[data-orig-name="${origName}"]:checked`);
      return Array.from(checkboxes).map(cb => cb.value.trim());
    },

    /**
     * Serializa todos los checkboxes a campos hidden
     */
    serialize() {
      // Días
      const daysValues = this.collectValues('days');
      this.ensureHiddenField('days').value = daysValues.join(', ');

      // Temas
      const topicsValues = this.collectValues('topics');
      this.ensureHiddenField('topics').value = topicsValues.join(', ');

      console.log('📦 Serializado:', {
        days: daysValues,
        topics: topicsValues
      });
    },

    /**
     * Inicializa el serializador
     */
    init() {
      this.detachNames();
      
      // Serializar en cada cambio de checkbox
      elements.form.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' && e.target.dataset.origName) {
          this.serialize();
        }
      });

      // Serialización inicial
      this.serialize();
    }
  };

  // ============================================
  // MANEJO DE STORAGE
  // ============================================
  const Storage = {
    /**
     * Guarda el código en localStorage
     */
    saveCode(code) {
      try {
        localStorage.setItem(CONFIG.storageKeys.lastCode, code);
      } catch (e) {
        console.warn('⚠️ No se pudo guardar el código en localStorage:', e);
      }
    },

    /**
     * Guarda datos del usuario en sessionStorage (temporal)
     */
    saveUserData() {
      try {
        const email = document.getElementById('pc-email')?.value || '';
        const name = document.getElementById('pc-name')?.value || '';

        sessionStorage.setItem(CONFIG.storageKeys.lastEmail, email);
        sessionStorage.setItem(CONFIG.storageKeys.lastName, name);
      } catch (e) {
        console.warn('⚠️ No se pudo guardar en sessionStorage:', e);
      }
    }
  };

  // ============================================
  // MANEJO DE ENVÍO DEL FORMULARIO
  // ============================================
  const FormSubmission = {
    /**
     * Añade clase de loading al botón
     */
    setLoading(isLoading) {
      if (!elements.submitButton) return;

      if (isLoading) {
        elements.submitButton.classList.add('loading');
        elements.submitButton.disabled = true;
        const span = elements.submitButton.querySelector('span');
        if (span) span.textContent = 'Enviando...';
      } else {
        elements.submitButton.classList.remove('loading');
        elements.submitButton.disabled = false;
        const span = elements.submitButton.querySelector('span');
        if (span) span.textContent = '✨ Completar Registro';
      }
    },

    /**
     * Maneja el evento submit
     */
    handleSubmit(e) {
      console.log('📝 Iniciando envío del formulario...');

      // Validar días
      if (!DaysValidation.validate()) {
        e.preventDefault();
        const firstDayCheckbox = DaysValidation.getCheckboxes()[0];
        if (firstDayCheckbox) {
          firstDayCheckbox.focus();
          firstDayCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }

      // Serializar checkboxes
      CheckboxSerializer.serialize();

      // Guardar código y datos
      Storage.saveCode(elements.codeInput?.value || '');
      Storage.saveUserData();

      // Detener renovación de código
      RegistrationCode.stop();

      // Estado de loading
      this.setLoading(true);

      console.log('✅ Formulario validado y listo para enviar');
    }
  };

  // ============================================
  // VALIDACIÓN EN TIEMPO REAL
  // ============================================
  const RealtimeValidation = {
    /**
     * Valida un campo individual
     */
    validateField(field) {
      if (!field.checkValidity()) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
      } else if (field.value.trim() !== '') {
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
      } else {
        field.classList.remove('is-valid', 'is-invalid');
      }
    },

    /**
     * Inicializa validación en tiempo real
     */
    init() {
      const inputs = elements.form.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"]), select, textarea');
      
      inputs.forEach(input => {
        // Validar al salir del campo (blur)
        input.addEventListener('blur', () => {
          if (input.value.trim() !== '' || input.hasAttribute('required')) {
            this.validateField(input);
          }
        });

        // Limpiar error al escribir
        input.addEventListener('input', () => {
          if (input.classList.contains('is-invalid')) {
            if (input.checkValidity()) {
              input.classList.remove('is-invalid');
            }
          }
          ProgressBar.update();
        });
      });
    }
  };

  // ============================================
  // DETECCIÓN DE PAGECLIP
  // ============================================
  const PageclipDetection = {
    check() {
      window.addEventListener('load', () => {
        if (typeof Pageclip !== 'undefined') {
          console.log('✅ Pageclip cargado correctamente');
          
          // Listener para eventos de Pageclip
          elements.form.addEventListener('pageclip-success', () => {
            console.log('✅ Formulario enviado con éxito a Pageclip');
            if (elements.successMessage) {
              elements.successMessage.classList.add('show');
            }
          });

          elements.form.addEventListener('pageclip-error', (e) => {
            console.error('❌ Error de Pageclip:', e);
            if (elements.errorMessage) {
              elements.errorMessage.classList.add('show');
            }
            FormSubmission.setLoading(false);
          });
        } else {
          console.warn('⚠️ Pageclip no se cargó correctamente');
        }
      });
    }
  };

  // ============================================
  // CONTADOR DE CARACTERES (opcional)
  // ============================================
  const CharacterCounter = {
    init() {
      const textarea = document.getElementById('pc-msg');
      if (!textarea) return;

      const maxLength = textarea.getAttribute('maxlength') || 500;
      
      // Crear elemento contador
      const counter = document.createElement('small');
      counter.className = 'form-text text-muted text-right d-block';
      counter.id = 'char-counter';
      textarea.parentNode.appendChild(counter);

      const updateCounter = () => {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${remaining} caracteres restantes`;
        
        if (remaining < 50) {
          counter.classList.add('text-warning');
          counter.classList.remove('text-muted');
        } else {
          counter.classList.add('text-muted');
          counter.classList.remove('text-warning');
        }
      };

      textarea.addEventListener('input', updateCounter);
      updateCounter();
    }
  };

  // ============================================
  // AUTO-GUARDADO (opcional)
  // ============================================
  const AutoSave = {
    storageKey: 'pc25_draft',
    timer: null,

    save() {
      try {
        const formData = {
          name: document.getElementById('pc-name')?.value || '',
          email: document.getElementById('pc-email')?.value || '',
          phone: document.getElementById('pc-phone')?.value || '',
          organization: document.getElementById('pc-org')?.value || '',
          role: document.getElementById('pc-role')?.value || '',
          comments: document.getElementById('pc-msg')?.value || '',
          timestamp: new Date().toISOString()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(formData));
        console.log('💾 Borrador guardado');
      } catch (e) {
        console.warn('⚠️ No se pudo guardar el borrador:', e);
      }
    },

    load() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (!saved) return false;

        const data = JSON.parse(saved);
        const savedDate = new Date(data.timestamp);
        const now = new Date();
        const hoursDiff = (now - savedDate) / (1000 * 60 * 60);

        // Solo restaurar si es del mismo día (menos de 24 horas)
        if (hoursDiff > 24) {
          this.clear();
          return false;
        }

        // Preguntar al usuario
        if (confirm('Se encontró un borrador guardado. ¿Deseas restaurarlo?')) {
          if (data.name) document.getElementById('pc-name').value = data.name;
          if (data.email) document.getElementById('pc-email').value = data.email;
          if (data.phone) document.getElementById('pc-phone').value = data.phone;
          if (data.organization) document.getElementById('pc-org').value = data.organization;
          if (data.role) document.getElementById('pc-role').value = data.role;
          if (data.comments) document.getElementById('pc-msg').value = data.comments;

          ProgressBar.update();
          console.log('📥 Borrador restaurado');
          return true;
        }
      } catch (e) {
        console.warn('⚠️ Error al cargar borrador:', e);
      }
      return false;
    },

    clear() {
      try {
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ Borrador eliminado');
      } catch (e) {
        console.warn('⚠️ No se pudo eliminar el borrador:', e);
      }
    },

    init() {
      // Cargar borrador al inicio
      this.load();

      // Guardar cada 30 segundos mientras el usuario escribe
      elements.form.addEventListener('input', () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.save();
        }, 30000);
      });

      // Limpiar borrador al enviar exitosamente
      elements.form.addEventListener('submit', () => {
        setTimeout(() => {
          this.clear();
        }, 1000);
      });
    }
  };

  // ============================================
  // ANALYTICS (opcional - para tracking)
  // ============================================
  const Analytics = {
    track(eventName, data = {}) {
      // Si tienes Google Analytics o similar
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
      }
      
      // Si tienes Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', eventName, data);
      }

      console.log('📈 Evento rastreado:', eventName, data);
    },

    init() {
      // Track cuando empieza a llenar el formulario
      let hasStarted = false;
      elements.form.addEventListener('input', () => {
        if (!hasStarted) {
          this.track('FormStarted', { form: 'registro_pycon_2025' });
          hasStarted = true;
        }
      }, { once: true });

      // Track progreso en hitos
      elements.form.addEventListener('input', () => {
        const progress = parseFloat(elements.progressBar?.style.width || '0');
        
        if (progress >= 25 && !this.milestone25) {
          this.track('FormProgress25', { form: 'registro_pycon_2025' });
          this.milestone25 = true;
        }
        if (progress >= 50 && !this.milestone50) {
          this.track('FormProgress50', { form: 'registro_pycon_2025' });
          this.milestone50 = true;
        }
        if (progress >= 75 && !this.milestone75) {
          this.track('FormProgress75', { form: 'registro_pycon_2025' });
          this.milestone75 = true;
        }
      });

      // Track envío exitoso
      elements.form.addEventListener('pageclip-success', () => {
        this.track('FormSubmitted', { 
          form: 'registro_pycon_2025',
          success: true 
        });
      });

      // Track errores
      elements.form.addEventListener('pageclip-error', () => {
        this.track('FormError', { 
          form: 'registro_pycon_2025',
          error: true 
        });
      });
    }
  };

  // ============================================
  // INICIALIZACIÓN PRINCIPAL
  // ============================================
  const App = {
    init() {
      console.log('🚀 Iniciando formulario PyCon Panamá 2025...');

      // Inicializar módulos
      RegistrationCode.init();
      CheckboxSerializer.init();
      DaysValidation.init();
      ProgressBar.update();
      RealtimeValidation.init();
      PageclipDetection.check();
      CharacterCounter.init();
      
      // Módulos opcionales (comentar si no se desean)
      // AutoSave.init();
      // Analytics.init();

      // Event listeners principales
      elements.form.addEventListener('input', () => ProgressBar.update());
      elements.form.addEventListener('change', () => ProgressBar.update());
      elements.form.addEventListener('submit', (e) => FormSubmission.handleSubmit(e));

      console.log('✅ Formulario inicializado correctamente');
    }
  };

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

})();